<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["file"]["name"][0]);
if($_FILES){
    if($_FILES['file']['error'][0]>0){
        echo 'Error:' . $_FILES['file']['error'][0]. '<br>';
    } else {
        if(move_uploaded_file($_FILES['file']['tmp_name'][0], $target_file)){
            echo json_encode(true);
        } else {
            echo json_encode(false);
        }
    }
}
