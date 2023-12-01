/* eslint-disable jsx-a11y/alt-text */
import { Order } from '@/app/(withHeader)/orders/interface';
import { Modal } from '@/components/ui/Modal';
import { Document, PDFViewer } from '@react-pdf/renderer';
import PackingSlip from './PackingSlip';

const PrintModalPackingSlip = ({
  open,
  onClose,
  orderDetail
}: {
  open: boolean;
  onClose: () => void;
  orderDetail: Order;
}) => {
  return (
    <Modal width="!w-[1050px]" title="Packing Slip" open={open} onClose={onClose}>
      <PDFViewer width="1000" height="600">
        <Document>
          <PackingSlip orderDetail={orderDetail} />
          {/* {orderDetail?.print_data?.map((item, index) => (
            <PackingSlip
              orderDetail={orderDetail}
              key={index}
              itemEachPackingSlip={item?.list_item}
            />
          ))} */}
        </Document>
      </PDFViewer>
    </Modal>
  );
};

export default PrintModalPackingSlip;
