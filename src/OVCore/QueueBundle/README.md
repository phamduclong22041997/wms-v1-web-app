Author: Thang Lam
Implement: Duy Huynh
Summary: This bundle implement priority queue technical. We have two part.
        One part manage all type of queue, it include highest priority. Another part manage all item of queue, it include lowest priority

Usages:
    \Ccicore\ActionQueueBundle\Lib\QueueManager::push(array(array(
        'cls'       => "\Smproc4\CciBundle\Biz\RecvBatchBiz",
        'method'    => 'post',
        'action'    => 'recvbatch_post', //Identify of routing
        'data' => <<posted data>> 
    )));
    - cls: class name of Biz Object
    - method: method of class name
    - action: Identify of api's routing
    - data: posted data of request
