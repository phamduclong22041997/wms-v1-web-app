<?php

namespace EFT\UtilityBundle\Lib;

use OVCore\MongoBundle\Lib\MongoDBManager;
use  OVCore\SecurityBundle\Lib\SecurityManager;

class UploadUtility {

    /**
     * Get Image
     */
    public static function getImage($file, $thumbnail = "")
    {
        
        $mongoDB = MongoDBManager::getClient();
        $bucket = $mongoDB->selectGridFSBucket();
        if($file) {
            $fileId = new \MongoDB\BSON\ObjectId($file);
           
            $stream = $bucket->openDownloadStream($fileId);
            $metadata = $bucket->getFileDocumentForStream($stream);
            return [
                'mimetype'  => $metadata->metadata['mimetype'],
                'data'      => stream_get_contents($stream)
            ];
        } else {
            if($thumbnail) {
                $fileId = new \MongoDB\BSON\ObjectId($thumbnail);
                $_file = $bucket->findOne(['_id' => $fileId]);
                
                if($_file != null) {
                    $thumbnail = $_file['metadata']?($_file['metadata']['thumbnail']??""):"";
                    
                    if($thumbnail != "") {
                        
                        $stream = $bucket->openDownloadStream(new \MongoDB\BSON\ObjectId($thumbnail));
                        $metadata = $bucket->getFileDocumentForStream($stream);
                        
                        return [
                            'mimetype'  => $metadata->metadata['mimetype'],
                            'data'      => stream_get_contents($stream)
                        ];
                    }
                }
            }
        }
        return null;
        
    }

    /**
     * Upload file
     */
    public static function uploadFile($file, $ref)
    {
        $result = "";
        
        $mongoDB = MongoDBManager::getClient();
        $bucket = $mongoDB->selectGridFSBucket();
        $_hash = md5(file_get_contents($file->getRealPath()));

        if($file->enableValidate === true) {
            $_file = $bucket->findOne(['metadata.hash' => $_hash]);
            if($total > 0) {
                throw new Exception("mess.uploadfile.exists");
            }
        } 
        if($file->enablePersist && !$file->enableValidate) {
            $_file = $bucket->findOne(['metadata.hash' => $_hash]);
            if($_file != null) {
                $result = (string)$_file->_id;
            }
        }
        if($result == "") {
            $clientInfo = SecurityManager::getClientInfo();
            $stream = fopen($file->getRealPath(), 'rb');
            $options = [
                'metadata' => [
                    'mimetype'      => $file->getMimeType(),
                    'ref'           => $ref,
                    'hash'          => $_hash,
                    'client'        => $clientInfo->getClient(),
                    'role'          => $clientInfo->getRole(),
                    'uploadby'      => $clientInfo->getId(),
                    'uploadbyname'  => $clientInfo->getLoginname()
                ]
            ];
            if($file->thumbnail) {
                $thumbnail = self::createThumbnail($stream, $file->thumbnail);
                if($thumbnail) {
                    $thumbnailStream = fopen('php://temp', 'w+b');
                    fwrite($thumbnailStream, $thumbnail);
                    rewind($thumbnailStream);
                    unset($thumbnail);
                    $thumbnail = (string)$bucket->uploadFromStream(
                        $file->getClientOriginalName(), 
                        $thumbnailStream, 
                        [
                            'metadata' => [
                                'mimetype'      => "image/png",
                                'ref'           => 'thumbnail',
                                'client'        => $clientInfo->getClient(),
                                'role'          => $clientInfo->getRole(),
                                'uploadby'      => $clientInfo->getId(),
                                'uploadbyname'  => $clientInfo->getLoginname()
                            ]
                        ]
                    );
                    $options['metadata']['thumbnail'] = $thumbnail;
                    fclose($thumbnailStream);
                }
            }
            
            $result = (string)$bucket->uploadFromStream($file->getClientOriginalName(), $stream, $options);
        }
        return $result;
    }

    /**
     * Upload file
     */
    public static function importFile($file, $columns)
    {
        try {
            $result = array();
            if($columns) {
                $columns = explode(",", $columns);
            }
            $result = ExcelUtility::readfile($file);
        }catch(\Exception $e) {}
        return $result;
    }

    /**
     * Create Thumbnail Image
     * @param $source string
     * @param $filename string
     * @return string
     */
    private static function createThumbnail($stream, $desired)
    {
        try {
            $source_image   = imagecreatefromstring(stream_get_contents($stream));

            $desired = explode("x", $desired);
            if(count($desired) > 1) {
                $desired_width  = (int)($desired[0]??100);
                $desired_height = (int)($desired[1]??100);
            } else {
                $desired_width  = 100;
                $desired_height = 100;
            }
            
            $width          = imagesx($source_image);
            $height         = imagesy($source_image);

            $desired_height = floor($height * ($desired_width / $width));

            // create a new, "virtual" image
            $virtual_image  = imagecreatetruecolor($desired_width, $desired_height);

            // copy source image at a resized size
            imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);

            ob_start();
            imagepng($virtual_image);
            $output = ob_get_contents();
            ob_end_clean();
        }catch(\Exception $e) {
            $output = "";
        }

        return $output;
    }
}
