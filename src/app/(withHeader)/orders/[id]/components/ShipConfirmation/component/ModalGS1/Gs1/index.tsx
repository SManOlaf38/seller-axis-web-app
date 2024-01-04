/* eslint-disable jsx-a11y/alt-text */
import { Image, Page, StyleSheet, Text, View, Font } from '@react-pdf/renderer';

import type { Order, OrderPackage } from '@/app/(withHeader)/orders/interface';

const GS1 = (props: {
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  forBarcode: string;
  sscc: string;
  orderPackageShipped: OrderPackage[];
}) => {
  return (
    <Page size="A6" style={styles.page}>
      <GS1View {...props} />
    </Page>
  );
};

export default GS1;

export const GS1View = ({
  orderDetail,
  ssccBarcode,
  shipToPostBarcode,
  forBarcode,
  sscc,
  orderPackageShipped
}: {
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  forBarcode: string;
  sscc: string;
  orderPackageShipped: OrderPackage[];
}) => {
  return (
    <View style={styles.surround}>
      <View style={styles.Row}>
        <View style={[styles.shipFrom, styles.flex1]}>
          <Text style={[styles.my2, styles.textHeader]}>From</Text>
          <Text style={styles.textContentSub}>{orderDetail?.ship_from?.contact_name}</Text>
          <Text style={styles.textContentSub}>{orderDetail?.ship_from?.address_1}</Text>
          <Text style={styles.textContentSub}>
            {orderDetail?.ship_from?.city} {orderDetail?.ship_from?.postal_code} ,{' '}
            {orderDetail?.ship_from?.country}
          </Text>
        </View>
        <View
          style={[
            styles.To,
            {
              flex: 1,
              paddingBottom: '16px'
            }
          ]}
        >
          <Text style={styles.textHeader}>To</Text>
          <View style={styles.mt4}>
            <Text style={styles.textContentSub}>{orderDetail?.verified_ship_to?.name}</Text>
            <Text style={styles.textContentSub}>{orderDetail?.verified_ship_to?.address_1}</Text>
            <Text style={styles.textContentSub}>
              {orderDetail?.verified_ship_to?.city} {orderDetail?.verified_ship_to?.postal_code} ,{' '}
              {orderDetail?.verified_ship_to?.country}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.Row}>
        <View
          style={[
            styles.ToWithRightBorder,
            {
              width: '70%'
            }
          ]}
        >
          <View style={styles.center}>
            <Text style={styles.textHeader}>SHIP TO POST </Text>
            <Text style={styles.ml4}>(420) {orderDetail?.ship_to?.postal_code}</Text>
          </View>

          {shipToPostBarcode && <Image src={shipToPostBarcode} />}
        </View>
        <View style={styles.contentCarrier}>
          <Text style={styles.textHeader}>Carrier</Text>
          <View style={styles.subContentCarrier}>
            <Text>PRO:</Text>
            <Text>B/L</Text>
          </View>
        </View>
      </View>
      <View style={styles.viewPO}>
        <View style={styles.mb20}>
          <Text style={styles.textHeader}>PO # {orderDetail?.po_number}</Text>
          <Text style={styles.textHeader}>
            SHIP UNIT COUNT - 1 Of {orderPackageShipped?.length}
          </Text>
        </View>
        <Text style={[styles.sos]}>SOS</Text>
      </View>
      <View style={styles.viewFor}>
        <View style={styles.contentFor}>
          <Text style={styles.textHeader}>FOR </Text>
          <View style={[styles.wFull]}>
            <Text style={styles.textCenter}>
              (91) {orderDetail?.ship_to?.partner_person_place_id}
            </Text>
            {forBarcode && <Image style={styles.mt4} src={forBarcode} />}
          </View>
        </View>
        <View style={styles.wFull}>
          <Text style={styles.mt4}> # {orderDetail?.ship_to?.partner_person_place_id}</Text>
        </View>
      </View>
      <View style={styles.lastRow}>
        <Text style={styles.textHeader}>SSCC</Text>
        <View>
          <Text style={styles.textCenter}>
            (00)
            {sscc
              ? ' ' +
                sscc.substr(2, 1) +
                ' ' +
                sscc.substr(3, 1) +
                ' ' +
                sscc.substr(4, 6) +
                ' ' +
                sscc.substr(10, 10) +
                ' ' +
                sscc.substr(20, 1)
              : ''}
          </Text>
          {ssccBarcode && <Image src={ssccBarcode} />}
        </View>
      </View>
    </View>
  );
};

export const InfoBottomLowes = () => {
  return (
    <View style={styles.viewContact}>
      <View style={styles.contentContact}>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          If you ordered more than the above-shown item(s), the rest of your items will be shipped
          and billed separately. A separate shipping document will be enclosed with that portion of
          your order.
        </Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          Check the status of your order by signing in to your mylowes account on Lowes.com and
          select Purchases.
        </Text>
        <Text style={styles.textHeaderContact}>Returns and Refunds Information</Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          Customer Satisfaction is our goal. If you are not completely satisfied with your purchase,
          let us know. For Return and Refund policy details and options:
        </Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          - Visit <Text style={styles.textUnderLine}>www.lowes.com/returns</Text>
        </Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          - Visit your local store. To find your nearest Lowe’s store, use our store locator
          available online at <Text style={styles.textUnderLine}>www.lowes.com</Text> or call our
          automated line at 1-800-44-LOWES (56937)
        </Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          {` - Contact Lowe's Customer Care toll free at 1-800-44-LOWES (56937)`}
        </Text>
        <Text style={[styles.textContact, { padding: '0 4px' }]}>
          - When contacting us, please include your Customer Order Number.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textUnderLine: {
    textDecoration: 'underline'
  },
  page: {
    backgroundColor: '#ffffff',
    color: 'black',
    fontSize: 10
  },
  container: {
    flexDirection: 'column',
    height: '100%',
    margin: '0px 20px'
  },
  mt20: {
    marginTop: '20px'
  },
  mb8: {
    marginBottom: '8px'
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
    flexDirection: 'row',
    padding: 4
  },
  lastRow: {
    borderTop: 4,
    padding: '4px'
  },
  shipFrom: {
    // padding: 4,
    borderRight: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  To: {
    paddingLeft: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  ToWithRightBorder: {
    borderRight: 1
  },
  sos: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: '20px',
    marginBottom: '16px',
    fontFamily: 'Times-Bold'
  },
  my2: {
    lineHeight: '2px'
  },
  logo: {
    height: '25px',
    width: '75px'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  textHeader: {
    fontSize: '11px',
    fontWeight: 'bold',
    marginBottom: '4px',
    textTransform: 'uppercase',
    fontFamily: 'Times-Bold'
  },
  textDescriptions: {
    fontSize: '6px'
  },
  containerPage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '10px'
  },
  section: {
    marginBottom: 20,
    width: '100%'
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  content: {
    padding: '2px 0px 2px 2px',
    fontSize: '10px',
    backgroundColor: 'black',
    color: 'white'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    width: '30%'
  },
  value: {
    width: '70%'
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    backgroundColor: 'black',
    fontWeight: 'bold',
    color: 'white',
    padding: '4px',
    textAlign: 'center',
    fontSize: '8px'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    fontSize: '8px',
    textAlign: 'center'
  },
  my10: {
    margin: '10px 0px'
  },
  textHeaderSub: {
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px',
    textAlign: 'center'
  },
  line: {
    height: '1px',
    width: '100%',
    backgroundColor: 'black'
  },
  contentSubHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '4px 0px'
  },
  contentOrderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewContact: {
    marginTop: 'auto',
    marginBottom: '20px'
  },
  contentContact: {
    borderWidth: 1,
    padding: '4px 0'
  },
  textContact: {
    fontSize: '7px',
    marginBottom: '8px'
  },
  textHeaderContact: {
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '10px',
    backgroundColor: 'black',
    color: 'white',
    padding: '4px'
  },
  viewPO: {
    width: '100%',
    borderBottom: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '4px',
    paddingTop: '20px',
    paddingBottom: '20px'
  },
  lh2: {
    lineHeight: '2px'
  },
  viewFor: {
    display: 'flex',
    flexDirection: 'row'
  },
  contentFor: {
    borderRight: 1,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '4px'
    // marginBottom: '10px',
    // marginTop: '10px'
  },
  wFull: {
    width: '100%'
  },
  textCenter: {
    textAlign: 'center'
  },
  textContent: {
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  textContentSub: {
    fontSize: '10px',
    lineHeight: '3px',
    textTransform: 'uppercase'
  },
  mt4: {
    marginTop: '4px'
  },
  ml4: {
    marginLeft: '4px'
  },
  flex1: {
    flex: 1
  },
  contentCarrier: {
    width: '30%',
    paddingLeft: '4px'
  },
  subContentCarrier: {
    marginTop: '20px',
    gap: '4px'
  },
  mb20: {
    marginBottom: '20px'
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
