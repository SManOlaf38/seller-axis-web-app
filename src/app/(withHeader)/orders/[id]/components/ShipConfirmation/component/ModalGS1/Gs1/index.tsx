/* eslint-disable jsx-a11y/alt-text */
import { Order } from '@/app/(withHeader)/orders/interface';
import { Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const GS1 = (props: {
  orderDetail: Order;
  ssccBarcode: string;
  shipToPostBarcode: string;
  forBarcode: string;
}) => {
  const { orderDetail } = props;
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.mt20}>
          <View style={styles.header}>
            <Image style={styles.logo} src="/lowes.png" />
            <View>
              <Text style={styles.textHeader}>Contact Us</Text>
              <Text style={styles.textDescriptions}>{`Lowe's Customer Care`}</Text>
              <Text style={styles.textDescriptions}>Phone: 1-800-44-LOWES (56937)</Text>
            </View>
          </View>

          <View style={styles.my10}>
            <Text style={styles.textHeaderSub}>Thank you for shopping </Text>
            <Text style={styles.tableCell}>We hope you enjoy your new purchase!</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.contentSubHead}>
            <Text style={styles.textDescriptions}>Page 1 of 1</Text>
            <Text style={styles.textDescriptions}>Refer to this information for all inquiries</Text>
          </View>
          <View style={styles.containerPage}>
            <View style={styles.section}>
              <Text style={styles.content}>Sold To:</Text>
              <Text style={styles.textDescriptions}>
                {orderDetail.customer?.name || orderDetail.ship_to?.name}
              </Text>
              <Text style={styles.textDescriptions}>
                {' '}
                {orderDetail.customer?.day_phone || orderDetail.ship_to?.day_phone}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.content}>Ship To:</Text>
              <Text style={styles.textDescriptions}>
                {orderDetail.verified_ship_to?.contact_name || orderDetail.ship_to?.name}
              </Text>
              <Text style={styles.textDescriptions}>
                {orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1}
              </Text>
              <Text style={styles.textDescriptions}>
                {orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2 || '-'}
              </Text>

              <Text style={styles.textDescriptions}>
                {orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city}{' '}
                {orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state}{' '}
                {orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code}{' '}
                {orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country}
              </Text>

              <Text style={styles.textDescriptions}>
                {orderDetail.verified_ship_to?.phone || orderDetail.ship_to?.day_phone}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.content}>Order Information:</Text>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>Order Number:</Text>
                <Text style={styles.textDescriptions}>{orderDetail.cust_order_number}</Text>
              </View>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>PO Number:</Text>
                <Text style={styles.textDescriptions}>{orderDetail.po_number}</Text>
              </View>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>Sales Date::</Text>
                <Text style={styles.textDescriptions}>{'-'}</Text>
              </View>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>Location:</Text>
                <Text style={styles.textDescriptions}>{'-'}</Text>
              </View>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>Salesperson:</Text>
                <Text style={styles.textDescriptions}>{'-'}</Text>
              </View>
              <View style={styles.contentOrderInfo}>
                <Text style={styles.textDescriptions}>Shipment Expectation:</Text>
                <Text style={styles.textDescriptions}>{'-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>Item #</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Item Description</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Model #</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Ordered</Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>Qty. Shipped</Text>
              </View>
              {orderDetail.items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item?.merchant_sku}</Text>
                  <Text style={styles.tableCell}>{item?.description}</Text>
                  <Text style={styles.tableCell}>{item?.product_alias?.sku}</Text>
                  <Text style={styles.tableCell}>{item?.qty_ordered}</Text>
                  <Text style={styles.tableCell}>{'-'}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.viewContact}>
          <View style={styles.contentContact}>
            <Text style={styles.textContact}>
              If you ordered more than the above-shown item(s), the rest of your items will be
              shipped and billed separately. A separate shipping document will be enclosed with that
              portion of your order.
            </Text>
            <Text style={styles.textContact}>
              Check the status of your order by signing in to your mylowes account on Lowes.com and
              select Purchases.
            </Text>
            <Text style={styles.textHeaderContact}>Returns and Refunds Information</Text>
            <Text style={styles.textContact}>
              Customer Satisfaction is our goal. If you are not completely satisfied with your
              purchase, let us know. For Return and Refund policy details and options:
            </Text>
            <Text style={styles.textContact}>- Visit www.lowes.com/returns</Text>
            <Text style={styles.textContact}>
              {`- Visit your local store. To find your nearest Lowe's store, use our store locator
              available online at www.lowes.com or call our automated line at 1-800-44-LOWES (56937)`}
            </Text>
            <Text style={styles.textContact}>
              {` - Contact Lowe's Customer Care toll free at 1-800-44-LOWES (56937)`}
            </Text>
            <Text style={styles.textContact}>
              - When contacting us, please include your Customer Order Number
            </Text>
          </View>
        </View>
      </View>

      <GS1View {...props} />
    </Page>
  );
};

export default GS1;

export const InfoBottomLowes = () => {
  return (
    <View style={styles.viewContact}>
      <View style={styles.contentContact}>
        <Text style={styles.textContact}>
          If you ordered more than the above-shown item(s), the rest of your items will be shipped
          and billed separately. A separate shipping document will be enclosed with that portion of
          your order.
        </Text>
        <Text style={styles.textContact}>
          Check the status of your order by signing in to your mylowes account on Lowes.com and
          select Purchases.
        </Text>
        <Text style={styles.textHeaderContact}>Returns and Refunds Information</Text>
        <Text style={styles.textContact}>
          Customer Satisfaction is our goal. If you are not completely satisfied with your purchase,
          let us know. For Return and Refund policy details and options:
        </Text>
        <Text style={styles.textContact}>- Visit www.lowes.com/returns</Text>
        <Text style={styles.textContact}>
          {`- Visit your local store. To find your nearest Lowe's store, use our store locator
        available online at www.lowes.com or call our automated line at 1-800-44-LOWES (56937)`}
        </Text>
        <Text style={styles.textContact}>
          {` - Contact Lowe's Customer Care toll free at 1-800-44-LOWES (56937)`}
        </Text>
        <Text style={styles.textContact}>
          - When contacting us, please include your Customer Order Number
        </Text>
      </View>
    </View>
  );
};

export const GS1View = ({
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
    <View style={styles.surround}>
      <View style={styles.Row}>
        <View style={styles.shipFrom}>
          <Text style={styles.my2}>From</Text>
          <Text style={styles.my2}>{orderDetail?.ship_from?.contact_name}</Text>
          <Text style={styles.my2}>{orderDetail?.ship_from?.address_1}</Text>
          <Text style={styles.my2}>
            {orderDetail?.ship_from?.city} {orderDetail?.ship_from?.postal_code}
          </Text>
          <Text style={styles.my2}>{orderDetail?.ship_from?.country}</Text>
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
        <View
          style={[
            styles.ToWithRightBorder,
            {
              width: '70%'
            }
          ]}
        >
          <Text style={styles.textHeader}>
            SHIP TO POST (420) {orderDetail?.ship_to?.postal_code}
          </Text>
          <Image src={shipToPostBarcode}></Image>
        </View>
        <View
          style={{
            width: '30%'
          }}
        >
          <Text style={styles.textHeader}>Carrier</Text>
          <Text>Pro:</Text>
          <Text>B/L</Text>
        </View>
      </View>
      <View style={styles.viewPO}>
        <View>
          <Text style={styles.lh2}>PO # {orderDetail?.po_number}</Text>
          <Text>SHIP UNIT COUNT - 1 Of {orderDetail?.order_packages?.length}</Text>
        </View>
        <Text style={styles.sos}>SOS</Text>
      </View>
      <View style={styles.viewFor}>
        <View style={styles.contentFor}>
          <Text>FOR </Text>
          <View style={styles.wFull}>
            <Text style={styles.textCenter}>
              (91) {orderDetail?.ship_to?.partner_person_place_id}
            </Text>
            {forBarcode && <Image src={forBarcode}></Image>}
          </View>
        </View>
        <View style={styles.wFull}>
          <Text> # {orderDetail?.ship_to?.partner_person_place_id}</Text>
        </View>
      </View>
      <View style={styles.lastRow}>
        <Text>SSCC</Text>
        {ssccBarcode && <Image src={ssccBarcode} />}
      </View>
    </View>
  );
};

// const widthUnit = 91;

const styles = StyleSheet.create({
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
    padding: 4,
    borderRight: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  To: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  ToWithRightBorder: {
    borderRight: 1
  },
  sos: {
    fontSize: 25,
    marginRight: '20px'
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
    fontSize: '10px',
    fontWeight: 'bold',
    marginBottom: '4px'
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
    padding: '4px'
  },
  textContact: {
    fontSize: '8px',
    marginBottom: '8px'
  },
  textHeaderContact: {
    fontSize: '12px',
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
  }
});
