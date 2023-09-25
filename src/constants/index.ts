export const LAYOUTS = {
  GRID: 'grid',
  LIST: 'list'
};

export const DataCountryRegion = [
  'AF',
  'AX',
  'AL',
  'DZ',
  'AS',
  'AD',
  'AO',
  'AI',
  'AQ',
  'AG',
  'AR',
  'AM',
  'AW',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BM',
  'BT',
  'BO',
  'BA',
  'BW',
  'BV',
  'BR',
  'IO',
  'BN',
  'BG',
  'BF',
  'BI',
  'KH',
  'CM',
  'CA',
  'CV',
  'KY',
  'CF',
  'TD',
  'CL',
  'CN',
  'CX',
  'CC',
  'CO',
  'KM',
  'CG',
  'CD',
  'CK',
  'CR',
  'CI',
  'HR',
  'CU',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'ET',
  'FK',
  'FO',
  'FJ',
  'FI',
  'FR',
  'GF',
  'PF',
  'TF',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GI',
  'GR',
  'GL',
  'GD',
  'GP',
  'GU',
  'GT',
  'GG',
  'GN',
  'GW',
  'GY',
  'HT',
  'HM',
  'VA',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IM',
  'IL',
  'IT',
  'JM',
  'JP',
  'JE',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KP',
  'KR',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MK',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MQ',
  'MR',
  'MU',
  'YT',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'MS',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'AN',
  'NC',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NU',
  'NF',
  'MP',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PN',
  'PL',
  'PT',
  'PR',
  'QA',
  'RE',
  'RO',
  'RU',
  'RW',
  'SH',
  'KN',
  'LC',
  'PM',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'CS',
  'SC',
  'SL',
  'SG',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'GS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SJ',
  'SZ',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TK',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TC',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UM',
  'UY',
  'UZ',
  'VU',
  'VE',
  'VN',
  'VG',
  'VI',
  'WF',
  'EH',
  'YE',
  'ZM',
  'ZW'
];

export function base64ToImage(base64String: string) {
  const img = `data:image/png;base64,${base64String}`;
  return img;
}

export const minDate = () => {
  const today = new Date().toISOString().split('T')[0];
  return today;
};

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const optionsPerPage = [
  {
    label: 5,
    value: 5
  },
  {
    label: 10,
    value: 10
  },
  {
    label: 25,
    value: 25
  },
  {
    label: 'All',
    value: -1
  }
];

export function resetOrientation(
  srcBase64: string,
  srcOrientation: any,
  callback: (data: any) => void
) {
  var img = new Image();

  img.onload = function () {
    var width = img.width,
      height = img.height,
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

    if (4 < srcOrientation && srcOrientation < 9) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    switch (srcOrientation) {
      case 2:
        ctx?.transform(-1, 0, 0, 1, width, 0);
        break;
      case 3:
        ctx?.transform(-1, 0, 0, -1, width, height);
        break;
      case 4:
        ctx?.transform(1, 0, 0, -1, 0, height);
        break;
      case 5:
        ctx?.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6:
        ctx?.transform(0, 1, -1, 0, height, 0);
        break;
      case 7:
        ctx?.transform(0, -1, -1, 0, height, width);
        break;
      case 8:
        ctx?.transform(0, -1, 1, 0, 0, width);
        break;
      default:
        break;
    }

    ctx?.drawImage(img, 0, 0);
    callback(canvas.toDataURL());
  };

  img.src = srcBase64;
}

export const headerProductAliasCSV = [
  { label: 'SKU Alias', key: 'sku' },
  { label: 'Product', key: 'product' },
  { label: 'Package Quantity', key: 'sku_quantity' },
  { label: 'Merchant SKU', key: 'merchant_sku' },
  { label: 'Vendor SKU', key: 'vendor_sku' },
  { label: 'Retailer', key: 'retailer' },
  { label: 'Merchant ID', key: 'merchant_id' },
  { label: 'UPC', key: 'upc' },
  { label: 'Retailer Warehouse', key: 'retailer_warehouse' },
  { label: 'QTY On Hand', key: 'qty_on_hand' },
  { label: 'Next Available QTY', key: 'next_available_qty' },
  { label: 'Next Available Date', key: 'next_available_date' }
];

export const keyBodyUploadFile = [
  { label: 'SKU Alias', key: 'sku' },
  { label: 'Product', key: 'product_sku' },
  { label: 'Package Quantity', key: 'sku_quantity' },
  { label: 'Merchant SKU', key: 'merchant_sku' },
  { label: 'Vendor SKU', key: 'vendor_sku' },
  { label: 'Retailer', key: 'retailer_name' },
  { label: 'Merchant ID', key: 'retailer_merchant_id' },
  { label: 'UPC', key: 'upc' },
  { label: 'Retailer Warehouse', key: 'warehouse_name' },
  { label: 'QTY On Hand', key: 'qty_on_hand' },
  { label: 'Next Available QTY', key: 'next_available_qty' },
  { label: 'Next Available Date', key: 'next_available_day' }
];

export const DATA_REFERENCE = [
  {
    value: 'customer_reference',
    label: 'Customer reference'
  },
  {
    value: 'po_number',
    label: 'PO number'
  },
  {
    value: 'invoice_number',
    label: 'Invoice number'
  },
  {
    value: 'department_number',
    label: 'Department number'
  }
];

export const ReferenceNameRegex = /{{.*?}}/g;
