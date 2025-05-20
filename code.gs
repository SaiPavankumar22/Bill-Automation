let lastInsertedRowData = {};

function doGet(e) {
  const page = e.parameter.page;
  if (page === "template") {
    return HtmlService.createHtmlOutputFromFile('template').setTitle("Generated Bill");
  }
  return HtmlService.createHtmlOutputFromFile('form').setTitle("Billing Form");
}

function getShopData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Shops');
  const data = sheet.getDataRange().getValues();
  const shops = {};
  for (let i = 1; i < data.length; i++) {
    shops[data[i][0]] = data[i][1];
  }
  return shops;
}

function getItemData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Items');
  const data = sheet.getDataRange().getValues();
  const items = {};
  for (let i = 1; i < data.length; i++) {
    items[data[i][0]] = data[i][1];
  }
  return items;
}

function submitForm(formData) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FormResponses');
  const now = new Date();
  
  let subtotal = 0;
  let gstTotal = 0;
  let total = 0;
  let totalCGST = 0, totalSGST = 0, totalIGST = 0;
  const itemData = [];

  formData.items.forEach(item => {
    const price = parseFloat(item.price);
    const qty = parseFloat(item.quantity);
    const gstRate = parseFloat(item.gstRate);
    const grossAmount = price * qty;
    const gstAmount = parseFloat(((grossAmount * gstRate) / (100 + gstRate)).toFixed(2));
    const baseAmount = grossAmount - gstAmount;
    
    subtotal += baseAmount;
    gstTotal += gstAmount;

    let cgst = '', sgst = '', igst = '';
    if (formData.state === 'Andhra Pradesh') {
      cgst = sgst = gstAmount / 2;
      totalCGST += cgst;
      totalSGST += sgst;
    } else {
      igst = gstAmount;
      totalIGST += igst;
    }

    itemData.push({
      item: item.item,
      hsn: item.hsn,
      price,
      quantity: qty,
      gstRate,
      grossAmount,
      gstAmount,
      cgst,
      sgst,
      igst
    });
  });

  total = subtotal + gstTotal;

  const newRow = [
    now, formData.shop, formData.gst, formData.city, formData.state, formData.date,
    JSON.stringify(itemData),
    subtotal.toFixed(2),
    totalCGST.toFixed(2),
    totalSGST.toFixed(2),
    totalIGST.toFixed(2),
    gstTotal.toFixed(2),
    total.toFixed(2)
  ];

  sheet.appendRow(newRow);

  // Save latest row for invoice generation
  lastInsertedRowData = {
    timestamp: now,
    shop: formData.shop,
    gst: formData.gst,
    city: formData.city,
    state: formData.state,
    date: formData.date,
    items: itemData,
    subtotal: subtotal.toFixed(2),
    totalCGST: totalCGST.toFixed(2),
    totalSGST: totalSGST.toFixed(2),
    totalIGST: totalIGST.toFixed(2),
    gstTotal: gstTotal.toFixed(2),
    total: total.toFixed(2)
  };

  return { message: "Bill submitted successfully!", redirectUrl: ScriptApp.getService().getUrl() + "?page=template" };
}

function getLastRowData() {
  return lastInsertedRowData;
}

function savePDFtoDrive(base64PDF, fileName) {
  const folderId = "1wzDsBHCRcTEKKun-_AUMgakQwGjV2vh-";
  const folder = DriveApp.getFolderById(folderId);
  const blob = Utilities.newBlob(Utilities.base64Decode(base64PDF), "application/pdf", fileName);
  const file = folder.createFile(blob);
  return file.getUrl();
}
