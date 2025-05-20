# Bill Automation

A powerful Google Apps Script-based web application for automating bill and invoice generation with comprehensive GST calculations. This application streamlines the billing process by providing an intuitive interface for creating, managing, and storing bills while automatically handling GST calculations for different states.

## Features

- **Dynamic Bill Generation**: Create bills with multiple items and automatic calculations
- **GST Support**: 
  - Automatic CGST/SGST calculation for intra-state transactions
  - IGST calculation for inter-state transactions
  - Support for different GST rates per item
- **Data Management**:
  - Stores shop information
  - Maintains item database
  - Records all bill transactions
- **PDF Generation**: Automatically saves generated bills as PDFs
- **Web Interface**: User-friendly form for bill creation
- **Google Sheets Integration**: All data is stored in Google Sheets for easy access and management

## Prerequisites

- Google Account
- Google Drive
- Google Sheets
- Basic understanding of Google Apps Script

## Setup Instructions

1. **Create a new Google Apps Script project**
   - Go to [Google Apps Script](https://script.google.com)
   - Create a new project

2. **Set up Google Sheets**
   Create a new Google Spreadsheet with the following sheets:
   - `Shops`: Store shop information (Name and Details)
   - `Items`: Store item details (Name and Details)
   - `FormResponses`: Store bill data (All transaction details)

3. **Copy the Code**
   - Copy the contents of `code.gs` into your Apps Script project
   - Create the necessary HTML files (`form.html` and `template.html`)

4. **Deploy the Web App**
   - Click on "Deploy" > "New deployment"
   - Choose "Web app"
   - Set the following:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"

5. **Configure Drive Folder**
   - Create a folder in Google Drive for storing PDFs
   - Update the `folderId` in the `savePDFtoDrive` function with your folder ID

## Usage

1. Access the web app using the deployed URL
2. Fill in the bill details:
   - Select shop from the dropdown
   - Enter GST number
   - Add items with quantities and prices
   - The system will automatically calculate GST based on the state
3. Submit the form to generate the bill
4. The bill will be automatically saved as a PDF in the configured Drive folder

## Data Structure

### Shops Sheet
- Column A: Shop Name
- Column B: Shop Details

### Items Sheet
- Column A: Item Name
- Column B: Item Details

### FormResponses Sheet
- Timestamp: Date and time of bill generation
- Shop: Selected shop name
- GST Number: Shop's GST number
- City: Shop's city
- State: Shop's state
- Date: Bill date
- Items: JSON string containing all item details
- Subtotal: Total before GST
- CGST: Central GST amount
- SGST: State GST amount
- IGST: Integrated GST amount
- GST Total: Total GST amount
- Total Amount: Final bill amount

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Author

**Devisetti Sai Pavan Kumar**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 