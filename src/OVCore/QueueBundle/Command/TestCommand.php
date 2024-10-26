<?php
namespace OVCore\QueueBundle\Command;

use OVCore\UtilityBundle\Lib\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


use OVCore\UtilityBundle\Lib\Utility;
use EFT\ProductBundle\Biz\ProductBiz;
use EFT\ProductBundle\Queue\ProductQueue;

class TestCommand extends BaseCommand
{
    protected static $defaultName = 'ovcore:test';

    protected function configure()
    {
        $this
            ->setName('ovcore:test')
            ->setDescription('OVCore Test')
            ->setHidden(true);
    }

     /**
     * Execution
     *
     * */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $industry = new \stdClass;
        $industry->code = 'DT';
        $industry->industryname = 'Điện tử';
        $industry->industryname_en = 'Electrical appliances';

        $status = new \stdClass;
        $status->statustype = 'Active';
        
        $expiredinfo = new \stdClass;
        $expiredinfo->dayscanrelease       = 30;
        $expiredinfo->dayscanreceive       = 30;
        $expiredinfo->preiodalert         = 30;
        $expiredinfo->numofalert            = 30;

        $data = array(
            'sku'                   => 'GOOD-SKU-04',
            'productname'           => 'SANPHAM-004',
            'productname_en'        => 'PRODUCT-004',
            'description'           => 'MO TA - 004',
            'description_en'        => 'MO TA - 004',
            'clientsku'             => 'CLIENT-SKU-004',
            'manufacture'           => 'DAIKIN',
            'industry'              => $industry ,
            'color'                 => 'Đen ơi là đen',
            'size'                  => 30,
            'effectivedate'         => new \DateTime(),
            'volume'                => 30 * 29 * 26,
            'weight'                => 30,
            'status'                => $status,
            'producttype'           => 'Sản phẩm đơn',
            'natureofproduct'       => '2112',
            'storagetype'           => 'Batch',
            'expiredmethod'         => 'Không có hạn sử dụng',
            'invmanagementmethod'   => 'Duy nhất',
            'goodmanagementmethod'  => 'FIFO',
            //'ref'                   => 'GOOD-SKU-003',
            //'isdeleted'             => true,
            'standardprice'         => 10000,
            'barcodelist'           => [
                ['barcode'=> 'BC-001', 'createddate'=> new \DateTime(), 'isdeleted'=> 0, 'issued'=>0, 'note'=>''],
                ['barcode'=> 'BC-002', 'createddate'=> new \DateTime(), 'isdeleted'=> 0, 'issued'=>0, 'note'=>''],
                ['barcode'=> 'BC-003', 'createddate'=> new \DateTime(), 'isdeleted'=> 0, 'issued'=>0, 'note'=>''],
                ['barcode'=> 'BC-004', 'createddate'=> new \DateTime(), 'isdeleted'=> 0, 'issued'=>0, 'note'=>''],
            ],
            'expiredinfo'   => $expiredinfo
           
           
        );
       
        //ProductBiz::save($data); 
        ProductQueue::saveProductQueue($data);                 
    }

 
}