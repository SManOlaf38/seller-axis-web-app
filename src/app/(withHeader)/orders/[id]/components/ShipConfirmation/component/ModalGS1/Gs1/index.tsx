import { Order } from '@/app/(withHeader)/orders/interface';
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const GS1 = ({
  orderDetail,
  ssccBarcode,
  shipToPostBarcode,
  forBarcode
}: {
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  forBarcode: string;
}) => {
  return (
    <Page size="A6" style={styles.page}>
      <View style={styles.surround}>
        <View style={styles.Row}>
          <View style={styles.shipFrom}>
            <Text>From1</Text>
            <Text>{orderDetail?.ship_from?.contact_name}</Text>
            <Text>{orderDetail?.ship_from?.address_1}</Text>
            <Text>
              {orderDetail?.ship_from?.city} {orderDetail?.ship_from?.postal_code}
            </Text>
            <Text>{orderDetail?.ship_from?.country}</Text>
          </View>
          <View style={styles.To}>
            <Text>To</Text>
            <Text>{orderDetail?.verified_ship_to?.name}</Text>
            <Text>{orderDetail?.verified_ship_to?.address_1}</Text>
            <Text>
              {orderDetail?.verified_ship_to?.city} {orderDetail?.verified_ship_to?.postal_code}
            </Text>
            <Text>{orderDetail?.verified_ship_to?.country}</Text>
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
            <Text>SHIP UNIT COUNT - 1 Of {orderDetail?.order_packages?.length}</Text>
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
  );
};

export default GS1;

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
    // borderTop: 4
  },
  shipFrom: {
    // height: heightUnit,
    borderRight: 1,
    padding: 10,
    paddingBottom: 15
  },
  From: {
    // height: heightUnit,
    width: widthUnit,
    borderRight: 1,
    padding: 10
  },
  To: {
    // height: heightUnit,
    width: 2 * widthUnit,
    padding: 10
  },
  ToWithRightBorder: {
    // height: heightUnit,
    width: 2 * widthUnit,
    padding: 10,
    borderRight: 1
  },
  sos: {
    fontSize: 30
  }
});
