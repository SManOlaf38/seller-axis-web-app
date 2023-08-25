/* eslint-disable jsx-a11y/alt-text */
import { Order, OrderPackage } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, Image, PDFViewer, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const PrintModalGS1 = ({
  open,
  onClose,
  orderDetail,
  ssccBarcode,
  shipToPostBarcode,
  print,
  forBarcode
}: {
  open: boolean;
  onClose: () => void;
  barcodeData: string[];
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  print: {
    barcode: string[];
    gs1: OrderPackage | null;
  };
  forBarcode: string;
}) => {
  return (
    <Modal title="GS1" open={open} onClose={onClose}>
      <PDFViewer
        style={{
          width: '100%',
          height: 500
        }}
      >
        <Document>
          <Page size="A6" style={styles.page}>
            <View style={styles.surround}>
              <View style={styles.Row}>
                <View style={styles.From}>
                  <Text>From</Text>
                </View>
                <View style={styles.To}>
                  <Text>To</Text>
                  <Text>{orderDetail?.ship_to?.name}</Text>
                  <Text>{orderDetail?.ship_to?.address_1}</Text>
                  <Text>
                    {orderDetail?.ship_to?.city} {orderDetail?.ship_to?.postal_code}
                  </Text>
                </View>
              </View>
              <View style={styles.Row}>
                <View style={styles.ToWithRightBorder}>
                  <Text>SHIP TO POST (420) {orderDetail?.ship_to?.postal_code}</Text>
                  <Image src={shipToPostBarcode}></Image>
                </View>
                <View style={styles.From}>
                  <Text>Carrier</Text>
                  <Text>Pro:</Text>
                  <Text>B/L</Text>
                </View>
              </View>
              <View style={styles.Row}>
                <View style={styles.To}>
                  <Text>PO # {orderDetail?.po_number}</Text>
                  <Text>
                    SHIP UNIT COUNT -{print?.gs1?.box?.name} Of{' '}
                    {orderDetail?.order_packages?.length}
                  </Text>
                </View>
                <View style={styles.From}>
                  <Text style={styles.sos}>SOS</Text>
                </View>
              </View>
              <View style={styles.Row}>
                <View style={styles.ToWithRightBorder}>
                  <Text>FOR (91) {orderDetail?.ship_to?.partner_person_place_id}</Text>
                  {forBarcode && <Image src={forBarcode}></Image>}
                </View>
                <View style={styles.From}>
                  <Text> # {orderDetail?.ship_to?.partner_person_place_id}</Text>
                </View>
              </View>
              <View style={styles.lastRow}>{ssccBarcode && <Image src={ssccBarcode}></Image>}</View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default PrintModalGS1;

const heightUnit = 66;
const widthUnit = 91;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: 'black',
    fontSize: 10
  },
  divider: {
    height: 30
  },
  surround: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,
    width: 272,
    height: 400
  },
  Row: {
    borderBottom: 1,
    display: 'flex',
    flexDirection: 'row'
  },
  lastRow: {
    borderTop: 4
  },
  From: {
    height: heightUnit,
    width: widthUnit,
    borderRight: 1,
    padding: 10
  },
  To: {
    height: heightUnit,
    width: 2 * widthUnit,
    padding: 10
  },
  ToWithRightBorder: {
    height: heightUnit,
    width: 2 * widthUnit,
    padding: 10,
    borderRight: 1
  },
  sos: {
    fontSize: 30
  }
});
