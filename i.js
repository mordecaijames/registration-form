function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Registrations");
    var data = e.parameter;

    var regID = "REG-" + Date.now();

    // Save fast
    sheet.appendRow([
      new Date(),
      regID,
      data.fullname || "",
      data.email || "",
      data.phone || "",
      data.gender || "",
      data.church || "",
      data.address || "",
      data.attendance || "",
      data.expectations || ""
    ]);

    // Fire email in background
    ScriptApp.newTrigger("sendConfirmationEmail")
             .timeBased()
             .after(1000)
             .create();

    PropertiesService.getScriptProperties().setProperty("emailPayload", JSON.stringify({
      email: data.email,
      regID: regID
    }));

    // 🔥 Respond instantly (FAST)
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", reg_id: regID }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendConfirmationEmail() {
  var payload = JSON.parse(PropertiesService.getScriptProperties().getProperty("emailPayload"));
  if (!payload || !payload.email) return;

  MailApp.sendEmail({
    to: payload.email,
    subject: "Prayer Conference Registration Confirmation",
    htmlBody:
      "<h3>Thank you for registering!</h3>" +
      "<p>Your registration was received successfully.</p>" +
      "<p><b>Registration ID: </b>" + payload.regID + "</p>" +
      "<p>We look forward to seeing you!</p>"
  });
}