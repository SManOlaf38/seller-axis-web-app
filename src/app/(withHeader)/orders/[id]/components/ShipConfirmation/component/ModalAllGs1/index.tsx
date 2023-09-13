import { Document, PDFViewer } from '@react-pdf/renderer';

import { Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import GS1 from '../ModalGS1/Gs1';

const ModalAllGs1 = ({
  open,
  onClose,
  orderDetail,
  printAllGs1
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
          {printAllGs1 &&
            orderDetail.order_packages.map((_, index: number) => (
              <GS1
                key={index}
                orderDetail={orderDetail}
                ssccBarcode={printAllGs1.ssccBarcode[index].tempSsccBarcode}
                shipToPostBarcode={printAllGs1.shipToPostBarcode}
                forBarcode={printAllGs1.forBarcode}
                sscc={printAllGs1.ssccBarcode[index].sscc}
              />
            ))}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default ModalAllGs1;
