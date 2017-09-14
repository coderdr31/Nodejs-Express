//Userlist data array for filling in info box
var userListData = [];

//DOM Ready =======================================
$(document).ready(function(){

    //Populate the user table on initial page load
    populateTable();
    //Username 链接点击事件绑定
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
    //Add User button 点击事件
    $('#btnAddUser').on('click', addUser);
    //删除用户链接点击事件
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
});

//Functions ===========================================

//添加数据到表格
function populateTable() {
    //Empty content string
    var tableContent = '';

    //jQuery AJAX使用JSON
    $.getJSON('/users/userlist', function(data){

        //将用户数据保存在全局变量中
        userListData = data;
        //把每一JSON数据item添加成行和列
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        //把所有内容都放到HTML表格中
        $('#userList table tbody').html(tableContent);
    });
};

//显示用户信息
function showUserInfo(event) {

    //阻止链接默认行为
    event.preventDefault();

    //从链接中获取用户名
    var thisUserName = $(this).attr('rel');

    //基于id值获取对象索引
    var arrayPosition = userListData
        .map(function (arrayItem) {return arrayItem.username;})
        .indexOf(thisUserName);
    //获取User对象
    var thisUserObject = userListData[arrayPosition];

    //填充Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
}
//添加用户
function addUser(event) {
    event.preventDefault();

    //最基本的验证,如果字段为空,errorCount自增1次
    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++
        }
    });

    //确定errorCount的数值为0
    if (errorCount === 0) {

        //如果是0, 将所有用户信息打包成一个对象
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        //使用AJAX将对象post到adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function (response) {
            //检查successful (blank) response
            if (response.msg === '') {
                //清空表单中输入内容
                $('#addUser fieldset input').val('');

                //更新表格
                populateTable();

            } else {
                //如果出错,提示错误信息
                alert('Error: ' + response.msg);
            }
        });
    } else {
        //如果errorCount大于0, 提示错误
        alert('Please fill in all fields');
        return false;
    }
}
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function (response) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
