// Global variables holding file details
var file = "";
var file_name = "";
var file_size = "";
var file_type = "";
var file_count = "";
var pwd = "";

/*
/Get file details and assign to variables
/@para : elenemt id
*/
function init(element) {
    file = $(element).get(0).files[0];
    file_name = $(element).get(0).files[0].name;
    file_size = ($(element).get(0).files[0].size / 1024 / 1024).toFixed(2);
    file_type = $(element).get(0).files[0].type;
    file_count = $(element).get(0).files.length;
    $('#file_name').val(file_name);
}

/*
/Validate password
/@para : password
/return : boolean
*/
function passwordValidation(pwd) {
    if (pwd == "") {
        swal("Oops!", "Please enter your password!", "error");
    } else {
        return true;
    }
}

/*
/Validate file info
/return : boolean
*/
function fileUploadValidation() {
    if (file_count <= 0) {
        swal("Oops!", "You must select a file to upload!", "error");
    } else if (file_size < 0.1) {
        swal("Oops!", "Your file too small to upload!", "error");
    } else if (file_size > 20) {
        swal("Oops!", "Your file too big to upload!", "error");
    } else {
        return true;
    }
}

function dateFormat() {
    var d = new Date();
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function getTableRowCount() {
    return $('#progress_tab tr').length;
}

/*
/Encrypted and upload file to server
/Display progress
/return : boolean
*/
function uploadFile() {
    var reader = new FileReader();
    reader.onload = function (e) {
        var encrypted = CryptoJS.AES.encrypt(e.target.result, pwd);
        var form_data = new FormData($('form')[0]);
        var encryptedFile = new File([encrypted], file_name + '.encrypted', { type: "text/plain", lastModified: new Date() });
        form_data.append('file[0]', encryptedFile);
        var upload_date = dateFormat();
        var table_rows = getTableRowCount();
        var progres_bar = "<div class='progress'><div class='progress-bar' id='progress_bar" + table_rows + "' role='progressbar' aria-valuenow='70'aria-valuemin='0' aria-valuemax='100' style='width:70%'><span class='sr-only'>70% Complete</span></div></div>";
        var mark_up = "<tr><td>" + upload_date + "</td><td>" + file_name + "</td><td>" + progres_bar + "</td></tr>";
        $('#progress_tab tbody').append(mark_up);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        var precentage = Math.round((e.loaded / e.total) * 100);
                        if(precentage < 0){
                            $('#progress_bar' + table_rows).attr('aria-valuenow', precentage).css({'width': precentage + '%','background-color': 'red'}).text(precentage + '%');
                        } else {
                            $('#progress_bar' + table_rows).attr('aria-valuenow', precentage).css({'width': precentage + '%','background-color': 'green'}).text(precentage + '%');
                        }
                        
                    }
                });
                return xhr;
            },
            type: "POST",
            url: "uploader.php",
            data: form_data,
            processData: false,
            contentType: false,
            success: function (res) {
                if (JSON.parse(res)) {
                    $('#file_name').val("");
                    swal("Done!", "File upload successfully!", "success");
                } else {
                    swal("Oops!", "Sorry, there was an error uploading your file!", "error");
                }
            },
            error: function (request, status, error) {
                console.log(status + '---' + error);
            }
        });
    };
    reader.readAsText(file);
}