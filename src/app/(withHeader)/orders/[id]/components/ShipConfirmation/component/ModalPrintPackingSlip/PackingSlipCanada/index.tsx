/* eslint-disable jsx-a11y/alt-text */
import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs';

import type { ItemOrder, Order } from '@/app/(withHeader)/orders/interface';

export default function PackingSlipCanada({
  orderDetail
}: // itemEachPackingSlip
{
  orderDetail: Order;
  // itemEachPackingSlip: ItemOrder[];
}) {
  return (
    <View style={styles.wFull}>
      <View style={styles.view}>
        <View
          style={[
            styles.w50,
            {
              flexDirection: 'row',
              alignItems: 'flex-end'
            }
          ]}
        >
          <Image style={styles.logo} src="/thp-canada.png" />
          <View style={styles.desLogo}>
            <Text style={[styles.text10, styles.fontBold]}>homedepot.ca</Text>
            <Text style={[styles.text10, styles.fontBold]}>1 800 628-0525</Text>
            <Text style={[styles.text10, styles.fontBold, styles.textUnderline]}>
              www.homedepot.ca
            </Text>
          </View>
        </View>
        <View style={[styles.w50, styles.textCenter]}>
          <Text style={[styles.text10, styles.fontBold, { fontStyle: 'italic' }]}>
            Thank you for choosing Homedepot.ca!
          </Text>
          <Text style={[styles.text10, styles.fontBold, { fontStyle: 'italic' }]}>
            Merci d’avoir choisi Homedepot.ca!
          </Text>
        </View>
      </View>
      <View style={[styles.table, { marginTop: '16px', borderBottom: 0 }]}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.textCenter]}>
            <Text style={styles.fontBold}>PURCHASE ORDER NO./N˚ BON D’ACHAT</Text>
            <Text>{orderDetail?.po_number || '-'}</Text>
          </View>

          <View style={[styles.tableCell, styles.textCenter]}>
            <Text style={styles.fontBold}>ORDER NO./N˚ DE COMMANDE</Text>
            <Text>{orderDetail?.cust_order_number || '-'}</Text>
          </View>
          <View style={[styles.tableCell, styles.textCenter, { borderRight: 0 }]}>
            <Text style={styles.fontBold}>DATE ENTERED/DATE D’INSCRIPTION</Text>
            <Text>
              {orderDetail?.order_date ? dayjs(orderDetail?.order_date).format('MM/DD/YYYY') : '-'}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.table, { borderBottom: 0 }]}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell]}>
            <Text style={[styles.fontBold, { marginBottom: '4px' }]}>SHIP TO/EXPÉDIE À:</Text>
            <Text>{orderDetail.verified_ship_to?.contact_name || orderDetail.ship_to?.name}</Text>
            <Text>{orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1}</Text>
            <Text>
              {orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2 || '-'}
            </Text>
            <Text>
              {orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city}{' '}
              {orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state}{' '}
              {orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code}{' '}
              {orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country}
            </Text>
            <Text>
              {orderDetail.verified_ship_to?.phone ||
                orderDetail.ship_to?.day_phone ||
                orderDetail?.bill_to?.day_phone}
            </Text>
          </View>
          <View style={[styles.tableCell, { borderRight: 0 }]}>
            <Text style={[styles.fontBold, { marginBottom: '4px' }]}>SOLD TO/VENDU À: </Text>
          </View>
        </View>
      </View>
      <View style={[styles.table, { height: 'auto', marginBottom: '4px' }]}>
        <View
          style={[
            styles.tableRow,
            {
              backgroundColor: '#b7b7b7',
              borderBottom: '1px'
            }
          ]}
        >
          <View style={[styles.headerCell, { flex: 1 }]}>
            <Text>QTY SHIP QTÉ EXPÉ</Text>
          </View>
          <View style={[styles.headerCell, { flex: 1.5 }]}>
            <Text>PRODUCT CODE CODE DU PRODUIT</Text>
          </View>
          <View style={[styles.headerCell, { flex: 2 }]}>
            <Text>VENDOR CODE CODE DU MARCHAND</Text>
          </View>
          <View style={[styles.headerCell, { flex: 4, borderRight: 0, width: '400px' }]}>
            <Text>DESCRIPTION AND SIZE DESCRIPTION ET FORMAT</Text>
          </View>
        </View>
        {orderDetail?.items?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item?.ship_qty_ordered || '-'}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{item?.merchant_sku || '-'}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item?.vendor_sku || '-'}</Text>
            <Text style={[styles.tableCell, { flex: 4, borderRight: 0, width: '400px' }]}>
              {item?.description}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.w55}>
          <Text style={[styles.text8, styles.fontBold]}>Return Policy Basics:</Text>
          <Text style={[styles.text8, styles.fontBold]}>
            For our complete return policy, please visit
          </Text>
          <Text
            style={[styles.text8, styles.fontBold, styles.textUnderline, { marginBottom: '4px' }]}
          >
            www.homedepot.ca/returns.
          </Text>
          <Text style={[styles.text8]}>
            For your convenience, items purchased on homedepot.ca can be returned to any of our
            Canadian stores within 90 days of purchase. Bring the item(s) with a copy of your
            shipping confirmation email to your local The Home Depot store for credit to your
            original tender or a The Home Depot store credit. Merchandise must be returned in
            unused, like-new condition. Please see Return Policy Exceptions (below) for further
            details.
          </Text>
        </View>
        <View
          style={{
            width: '43%'
          }}
        >
          <Text style={[styles.text8, styles.fontBold]}>
            Politique élémentaire sure les retours:
          </Text>
          <Text style={[styles.text8, styles.fontBold]}>
            Pour notre politique complète sur les retours, veuillez visiter
          </Text>
          <Text
            style={[styles.text8, styles.fontBold, styles.textUnderline, { marginBottom: '4px' }]}
          >
            www.homedepot.ca/contenu/service-a-laclientele/politique-de-retours.
          </Text>
          <Text style={[styles.text8]}>
            Pour plus de commodité, tout article acheté sur homedepot.ca peut être rapporté à
            n’importe quel magasin Home Depot du Canada, dans les 90 jours suivant la date d’achat.
            Rapportez l’article au magasin le plus près, accompagné d’une copie du courriel de
            confirmation d’expédition pour obtenir qu’un crédit soit porté à votre carte de créditou
            compte originale, ou qu’un credit de magasin vous soit accordé. Tout article retourné
            doit être intact et à l’état neuf. Veuillez consulter les exceptions à la politique sur
            les retours (ci-dessous) pour plus de détails.
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
        <View style={styles.w55}>
          <Text style={[styles.text8]}>
            Online returns can also be made by calling 1-800- 628-0525 within 90 days of purchase.
            We’ll arrange for your item to be picked up and returned, as well as provide you with a
            return authorization number (RA#).
          </Text>
        </View>
        <View
          style={{
            width: '43%'
          }}
        >
          <Text style={[styles.text8]}>
            Les achats faits en ligne peuvent aussi être retourné en téléphonant au 1 800 628-0525
            dans les 90 jours suivant la date d’achat. Nous organizerons le ramassage et le retour
            sans frais, et nous vous fournirons un numéro d’autorisation de retour (no d’AR).
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={styles.w55}>
          <Text style={[styles.text8]}>
            + You must include all packaging provided, as failure to comply may result in no credit
            being issued. Restrictions apply.
          </Text>
          <Text style={[styles.text8]}>
            + You must include all packaging provided, as failure to comply may resul
          </Text>
          <Text style={[styles.text8]}>
            + Hazardous items that use flammable liquids or gases and live plants cannot be returned
            to homedepot.ca.
          </Text>
          <Text style={[styles.text8]}>
            + All missing parts, damage and shortage claims should be reported to our Customer
            Service Centre within 48 hours of delivery.
          </Text>
          <Text style={[styles.text8]}>
            + All refunds will be credited back to the original credit card.
          </Text>
        </View>
        <View
          style={{
            width: '43%'
          }}
        >
          <Text style={[styles.text8]}>
            + Vous devez inclure tous les emballages d’origine, à défaut de quoi il est possible
            qu’aucun credit ne vous soit accordé. Notez que des restrictions s’appliquent.
          </Text>
          <Text style={[styles.text8]}>
            + Les articles dangereux qui fonctionnent avec des liquides ou des gaz inflammables, et
            les plantes naturelles ne peuvent pas être retournés à homedepot.ca.
          </Text>
          <Text style={[styles.text8]}>
            + Toute demande relative à des pièces manquantes, endommangées ou en quantité
            insuffisante doit être formulée auprès de notre Centre de service à la clientele dans
            les 48 heures suivant la livraison.
          </Text>
          <Text style={[styles.text8]}>
            + Tout remboursement sera effectué par note de crédit portée à la carte ayant servi à
            l’achat.
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '30px' }}>
        <View style={styles.w55}>
          <Text style={[styles.text8, styles.fontBold, { marginBottom: '4px' }]}>
            If you are shipping your return back to us:
          </Text>
          <Text style={[styles.text8]}>
            + Call our Customer Service Centre at 1-800-628- 0525 to obtain a Returns Authorization
            (RA) number and arrange shipment of your return.
          </Text>
          <Text style={[styles.text8]}>
            + Use the original packaging to return all items and include the customer receipt and
            original packing slip. Pack and tape all boxes securely.
          </Text>
          <Text style={[styles.text8]}>
            + Complete the reason for return below and include with item being returned.
          </Text>
          <Text style={[styles.text8]}>
            + Affix the prepaid return label (if applicable) to the package. Please note the
            tracking number on the return label for your records.
          </Text>
          <Text style={[styles.text8]}>
            + If your item is being returned by a common carrier, the carrier will call to schedule
            a pick-up.
          </Text>
        </View>
        <View
          style={{
            width: '43%'
          }}
        >
          <Text style={[styles.text8, styles.fontBold, { marginBottom: '4px' }]}>
            Si vous décidez de réexpédier votre article:
          </Text>
          <Text style={[styles.text8]}>
            + Téléphonez à notre Centre de service à la clientèle au 1 800 628-0525 pour organizer
            le ramassage de votre article et obtenir un numéro d’autorisation de retour (no d’AR).
          </Text>
          <Text style={[styles.text8]}>
            + Retournez l’article dans son emballage d’origine et joignez-y le reçu et le bordereau
            de livraison original. Ensuite, emballez le tout de façon sécuritaire et fermez
            l’emballage à l’aide de ruban adhésif.
          </Text>
          <Text style={[styles.text8]}>
            + Indiquez la raison du retour (voir ci-dessous) et joignez celle-ci à l’article à
            retourner.
          </Text>
          <Text style={[styles.text8]}>
            + Tout remboursement sera effectué par note de crédit portée à la carte ayant servi à
            l’achat.
          </Text>
          <Text style={[styles.text8]}>
            + Apposez l’étiquette de retour prépayée (le cas échéant) sur l’emballage. Veuillez
            noter le numéro de suivi inscrit sur l’étiquette et le conserver pour vos dossiers.
          </Text>
          <Text style={[styles.text8]}>
            + Si votre article est retourné par un transporteur public, celui-ci peut vous appeler
            pourplanifier un ramassage.
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px' }}>
        <View style={styles.w55}>
          <Text style={[styles.text8, styles.fontBold, { marginBottom: '4px' }]}>
            Please indicate the reason for return:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>Wrong Item Shipped</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>Defective/Parts Missing</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>Damaged During Transportation</Text>
          </View>
          <Text style={[styles.text8]}>Other:</Text>
        </View>
        <View
          style={{
            width: '43%'
          }}
        >
          <Text style={[styles.text8, styles.fontBold, { marginBottom: '4px' }]}>
            Veuillez indique la raison du retour:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>Mauvais article livré</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>
              Article défectueux/pièces manquantes
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '2px' }}>
            <Image style={styles.iconCheckbox} src="/checkbox_img.png" />
            <Text style={[styles.text8, { marginLeft: '4px' }]}>
              Article endommagé durant le transport
            </Text>
          </View>
          <Text style={[styles.text8]}>Autres:</Text>
        </View>
      </View>
      <Text style={[styles.fontBold, styles.textCenter, styles.text8, { marginTop: '25px' }]}>
        CLIENT COPY/COPIE DU CLIENT
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconCheckbox: {
    width: '10px',
    height: '10px'
  },
  text10: {
    fontSize: '10px'
  },
  text8: {
    fontSize: '8px'
  },
  textCenter: {
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  fontBold: {
    fontWeight: 'bold',
    fontFamily: 'Times-Bold'
  },
  textUnderline: {
    textDecoration: 'underline'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  desLogo: {
    marginLeft: '4px'
  },
  logo: {
    width: '60px',
    height: '60px'
  },
  wFull: {
    width: '100%'
  },
  view: {
    flexDirection: 'row',
    width: '100%',
    gap: '8px'
  },
  w50: {
    width: '50%'
  },
  w55: {
    width: '55%'
  },
  table: {
    width: '100%',
    borderWidth: '1px'
  },
  headerCell: {
    fontSize: '8px',
    textAlign: 'center',
    flex: 1,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: '1px',
    padding: '4px'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    fontSize: '8px',
    borderRight: '1px',
    padding: '4px'
  }
});
