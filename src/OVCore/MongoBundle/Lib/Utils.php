<?php
namespace OVCore\MongoBundle\Lib;

class Utils {
    /**
     * Pagination for query
     **/
    public static function paginationResult($collection, $filters = [], $options = [])
    {
        $total = $collection->count($filters);
        $result = [
            'cursor'    => [],
            'total'     => $total,
            'start'     => 0
        ];
        if($total == 0) {
            return $result;
        }
        $_options = [];
        if(isset($options['limit']) && $options['limit']) {
            $_options['limit'] = (int)$options['limit'];
        }

        if(isset($options['sort']) && $options['sort']) {
            $_options['sort'] = $options['sort'];
        }

        if(isset($options['page']) && $options['page']) {
            $_page = (int)$options['page'];
            $_limit = $_options['limit']??0;
            $start = $_page*$_limit;
            if($start >= $total) {
                $start = (round($total/$_limit, 0) -1) * $_limit;
            }
            $_options['skip']   = $start;
            $result['start']    = $start;
        }
        $result['cursor'] = $collection->find($filters, $_options);
        return $result;
    }
}