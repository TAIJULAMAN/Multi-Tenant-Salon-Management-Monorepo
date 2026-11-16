import { spawn } from "child_process";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  console.log("Starting Chrome in headless mode...");
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-sandbox",
    "about:blank",
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch("http://127.0.0.1:9222/json/version");
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    if (!versionData) {
      throw new Error("Could not connect to Chrome CDP");
    }

    const newPageRes = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" });
    const target = await newPageRes.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let msgId = 1;
    const callbacks = new Map();
    const pageErrors = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === "Runtime.exceptionThrown") {
        pageErrors.push(msg.params.exceptionDetails);
        console.error("PAGE EXCEPTION:", msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
      }
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

    function send(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve) => {
        callbacks.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send("Page.enable");
    await send("Runtime.enable");

    async function gotoUrl(url, waitMs = 2500) {
      await send("Page.navigate", { url });
      await new Promise((r) => setTimeout(r, waitMs));
    }

    async function evalCode(expression) {
      const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      return res.result?.result?.value;
    }

    const results = [];

    function record(testName, passed, details = "") {
      results.push({ testName, passed, details });
      console.log(`${passed ? "✅ PASS" : "❌ FAIL"}: ${testName} ${details ? `(${details})` : ""}`);
    }

    // TEST 1: Modals & Selects on /salons/my-salons
    console.log("\n--- Checking /salons/my-salons ---");
    await gotoUrl("http://localhost:3000/salons/my-salons");

    // Click Invite New Salon
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Invite New Salon'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isInviteModalOpen = await evalCode(`
      document.body.innerText.includes("Company Name") || document.body.innerText.includes("Commercial Name")
    `);
    record("InviteSalonModal Open", isInviteModalOpen);

    // Close Invite Modal
    await evalCode(`
      (() => {
        const closeBtn = document.querySelector('button[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // Click View on Salon row
    await evalCode(`
      (() => {
        const eyeBtn = document.querySelector('tbody button');
        if (eyeBtn) eyeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isViewModalOpen = await evalCode(`
      document.body.innerText.includes('View Salon') && document.body.innerText.includes('Company Information')
    `);
    record("ViewSalonModal Open", isViewModalOpen);

    // Close ViewSalonModal
    await evalCode(`
      (() => {
        const closeBtn = document.querySelector('button[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // Selects & Filtering on /salons/my-salons
    await evalCode(`
      (() => {
        const selectBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'All');
        if (selectBtn) selectBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    const statusOptionClicked = await evalCode(`
      (() => {
        const opt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Connected');
        if (opt) {
          opt.click();
          return true;
        }
        return false;
      })()
    `);
    await new Promise(r => setTimeout(r, 500));
    const connectedRowsCount = await evalCode(`document.querySelectorAll('tbody tr').length`);
    record("Status Select & Table Filter", statusOptionClicked && connectedRowsCount > 0, `Rows: ${connectedRowsCount}`);

    // Switch to Payouts Tab
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Payouts');
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const payoutsTabActive = await evalCode(`
      document.body.innerText.includes('Available for withdrawal') || document.body.innerText.includes('Request History')
    `);
    record("Payouts Tab Switch", payoutsTabActive);

    // Click Request Payout
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Request Payout'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isRequestPayoutModalOpen = await evalCode(`
      document.body.innerText.includes('Request Payout') && document.body.innerText.includes('Amount to Withdraw')
    `);
    record("RequestPayoutModal Open", isRequestPayoutModalOpen);

    // Test typing amount in RequestPayoutModal
    const amountVal = await evalCode(`
      (() => {
        const input = document.querySelector('input[placeholder="Enter amount"], input[value="1000"]');
        return input ? input.value : null;
      })()
    `);
    record("RequestPayoutModal Amount Editable", amountVal === "1000");

    // Close RequestPayoutModal
    await evalCode(`
      (() => {
        const closeBtn = document.querySelector('button[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 2: /taxes/new-upload (CustomSelects)
    console.log("\n--- Checking /taxes/new-upload ---");
    await gotoUrl("http://localhost:3000/taxes/new-upload");

    // Click Salon Select
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Select Salon');
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    const salon1Selected = await evalCode(`
      (() => {
        const opt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Salon 1');
        if (opt) {
          opt.click();
          return true;
        }
        return false;
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    const salon1Active = await evalCode(`
      Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Salon 1'))
    `);
    record("CustomSelect Salon Selection", salon1Selected && salon1Active);

    // Click Tax Type Select
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Select Tax Type');
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    const vatSelected = await evalCode(`
      (() => {
        const opt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'VAT');
        if (opt) {
          opt.click();
          return true;
        }
        return false;
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    const vatActive = await evalCode(`
      Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('VAT'))
    `);
    record("CustomSelect Tax Type Selection", vatSelected && vatActive);

    // TEST 3: /taxes/history (ExportModal)
    console.log("\n--- Checking /taxes/history ---");
    await gotoUrl("http://localhost:3000/taxes/history");
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Export Report'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isTaxExportOpen = await evalCode(`
      document.body.innerText.includes('Export Chart Data')
    `);
    record("ExportModal on /taxes/history", isTaxExportOpen);
    await evalCode(`
      (() => {
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Cancel');
        if (cancelBtn) cancelBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 4: /salaries/history (ExportModal)
    console.log("\n--- Checking /salaries/history ---");
    await gotoUrl("http://localhost:3000/salaries/history");
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Export Data'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isSalaryExportOpen = await evalCode(`
      document.body.innerText.includes('Export Chart Data')
    `);
    record("ExportModal on /salaries/history", isSalaryExportOpen);
    await evalCode(`
      (() => {
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Cancel');
        if (cancelBtn) cancelBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 5: /documents/contracts
    console.log("\n--- Checking /documents/contracts ---");
    await gotoUrl("http://localhost:3000/documents/contracts");
    const newContractHref = await evalCode(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('New Contract'));
        return link ? link.getAttribute('href') : null;
      })()
    `);
    record("Contracts Overview 'New Contract' Link", newContractHref === "/documents/contracts/new");

    // Open row action dropdown and click Modify
    await evalCode(`
      (() => {
        const actionBtn = document.querySelector('tbody tr td:last-child button');
        if (actionBtn) actionBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    await evalCode(`
      (() => {
        const modifyBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Modify'));
        if (modifyBtn) modifyBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isModifyModalOpen = await evalCode(`
      document.body.innerText.includes('Modify Contract')
    `);
    record("ModifyContractModal Open", isModifyModalOpen);
    await evalCode(`
      (() => {
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Cancel');
        if (cancelBtn) cancelBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 6: /documents/employee-notices
    console.log("\n--- Checking /documents/employee-notices ---");
    await gotoUrl("http://localhost:3000/documents/employee-notices");
    const uploadNoticeHref = await evalCode(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Upload Notice'));
        return link ? link.getAttribute('href') : null;
      })()
    `);
    record("Employee Notices 'Upload Notice' Link", uploadNoticeHref === "/documents/employee-notices/upload");

    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Send Notice'));
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isSendNoticeModalOpen = await evalCode(`
      document.body.innerText.includes('Send Notice') && document.body.innerText.includes('Select Employee')
    `);
    record("SendNoticeModal Open", isSendNoticeModalOpen);
    await evalCode(`
      (() => {
        const closeBtn = document.querySelector('button[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 7: /settings
    console.log("\n--- Checking /settings ---");
    await gotoUrl("http://localhost:3000/settings");
    await evalCode(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Security');
        if (btn) btn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const securityActive = await evalCode(`
      document.body.innerText.includes('Two-factor Authentication') && document.body.innerText.includes('Password')
    `);
    record("Settings Security Tab Switch", securityActive);

    // Open Change Password Modal
    await evalCode(`
      (() => {
        const changeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Change');
        if (changeBtn) changeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const isPasswordModalOpen = await evalCode(`
      document.body.innerText.includes('Change Password') && document.body.innerText.includes('Current Password')
    `);
    record("ChangePassword Modal Open", isPasswordModalOpen);
    await evalCode(`
      (() => {
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === 'Cancel');
        if (cancelBtn) cancelBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));

    // TEST 8: /salons/request-access
    console.log("\n--- Checking /salons/request-access ---");
    await gotoUrl("http://localhost:3000/salons/request-access");
    const reqRolePlaceholder = await evalCode(`
      Array.from(document.querySelectorAll('button')).some(b => b.innerText === 'Select Role')
    `);
    record("Request Access Role Select Placeholder", reqRolePlaceholder);

    // TEST 9: /budgeting/payments
    console.log("\n--- Checking /budgeting/payments ---");
    await gotoUrl("http://localhost:3000/budgeting/payments");
    const importReceiptsHref = await evalCode(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Import Receipts'));
        return link ? link.getAttribute('href') : null;
      })()
    `);
    record("Payments 'Import Receipts' Link", importReceiptsHref === "/budgeting/payments/import");

    const automationsHref = await evalCode(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('Set Automations'));
        return link ? link.getAttribute('href') : null;
      })()
    `);
    record("Payments 'Set Automations' Link", automationsHref === "/budgeting/payments/automations");

    // Close page
    await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);

    console.log("\n==========================================");
    console.log("TEST SUMMARY");
    console.log("==========================================");
    const passedCount = results.filter(r => r.passed).length;
    console.log(`Passed: ${passedCount}/${results.length}`);
    console.log(`Page Exceptions: ${pageErrors.length}`);

    if (passedCount === results.length && pageErrors.length === 0) {
      console.log("ALL TESTS COMPLETED SUCCESSFULLY! 🎉");
    } else {
      console.log("SOME TESTS FAILED! Review output above.");
    }
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
