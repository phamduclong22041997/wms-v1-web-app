<?php
namespace OVCore\QueueBundle\Command;

use OVCore\UtilityBundle\Lib\BaseCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

use OVCore\QueueBundle\Lib\ActionQueue;
use OVCore\QueueBundle\Lib\ActionQueueManager;
use OVCore\UtilityBundle\Lib\Utility;


class QueueCommand extends BaseCommand
{
    protected static $defaultName = 'ovcore:queue';

    protected function configure()
    {
        $this
            ->setName('ovcore:queue')
            ->setDescription('OVCore Queue')
            ->setHidden(true);
    }

     /**
     * Execution
     *
     * */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        
        $this->runQueue();
        //$this->createQueueManager();
    }

    /**
     * Description: Run Action Queue
     */
    private function runQueue()
    {
        $lastLogin = null;

        while(true) {
            $data = ActionQueue::pop();
            if($data == null)
                break;
            try {
                if($data['modifiedby']['id'] != $lastLogin) {
                    $this->login($data['modifiedby']);
                    $lastLogin = $data['modifiedby']['id'];
                }

                $data['cls']::{$data['method']}($data['datarows']);

                //Waiting for next process
                ActionQueue::success($data['id']);
            }catch(\Exception $e) {
                $message = $e->getMessage().'_'.$e->getFile().'-'.$e->getLine();
                ActionQueue::error($data['id'], $message);
            }
        }
    }

    private function createQueueManager(){
        $collection = ActionQueueManager::getCollection();
        $collection->insertOne(array(
            'name'  => 'Create Purchase Order',
            'type'  => 'create_po',
            'total' => 0,
            'priority' => 1,
            'numberofrows'  => 1,
            'isdeleted' => 0
        ));      
    }
}