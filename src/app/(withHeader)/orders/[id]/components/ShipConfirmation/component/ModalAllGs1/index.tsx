import { Document, PDFViewer } from '@react-pdf/renderer';

import type { Order, OrderPackage } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';

const ModalAllGs1 = ({
  open,
  onClose,
  orderDetail,
  printAllGs1,
  orderPackageShipped
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
  printAllGs1:
    | {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: {
          tempSsccBarcode: string;
          sscc: string;
        }[];
      }
    | undefined;
  orderPackageShipped: OrderPackage[];
}) => {
  return (
    <Modal title="All GS1" open={open} onClose={onClose}>
      <PDFViewer
        style={{
          width: '100%',
          height: 500
        }}
      >
        <Document>
          {printAllGs1?.ssccBarcode?.map(
            (item, index) =>
              item?.sscc && (
                <GS1
                  key={index}
                  orderDetail={orderDetail}
                  ssccBarcode={item?.tempSsccBarcode}
                  shipToPostBarcode={printAllGs1.shipToPostBarcode}
                  forBarcode={printAllGs1.forBarcode}
                  sscc={item?.sscc}
                  orderPackageShipped={orderPackageShipped}
                />
              )
          )}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalAllGs1;
