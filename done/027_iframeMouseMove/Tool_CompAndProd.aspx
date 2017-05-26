<%@ Page Language="VB" %>
<%@ import Namespace="System.Data" %>
<%@ import Namespace="System.Data.sqlclient" %>

<!DOCTYPE html>

<script runat="server">
    Dim AdmConn As SqlConnection = DB.GetOpenedConnection
    Dim cmd As New SqlCommand

    Public Key As String = ""
    Public FieldName As String = ""
    Public targetFrame As String = ""

    Public applyList As String = ""
    Public prodStr As String = ""

    Protected Sub Page_Init(sender As Object, e As EventArgs) Handles Me.Init
        FieldName = Trim(Request("FieldName") & "")
        targetFrame = Trim(Request("targetFrame") & "")
        Key = Trim(Request("Key") & "")
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim Cate As String = Trim(Request("Cate") & "")
        Dim CateList As String() = Cate.Split("|")
        Dim i As Integer = 0

        Dim cmd As New SqlCommand
        cmd.Connection = DB.GetOpenedConnection

        cmd.CommandText = "SELECT [product] FROM [ComponentAndProduct] WHERE [component]=@component"
        cmd.Parameters.Clear()
        cmd.Parameters.AddWithValue("component", Key)

        Dim DT As DataTable = DB.getTable(cmd)


        If DT.Rows.Count > 0 Then
            For i = 0 To DT.Rows.Count - 1
                If i <> 0 Then
                    applyList &= ","
                End If
                applyList &= DT.Rows(i)("product")
            Next
        End If

        cmd.Parameters.Clear()
        Dim CateStr As String = ""
        For i = 0 To CateList.Length - 1
            If i <> 0 Then
                CateStr &= ","
            End If
            CateStr &= "@PARA" & i

            cmd.Parameters.AddWithValue("@PARA" & i, CateList(i))
        Next
        cmd.CommandText = "SELECT [id], [Category], [Serial] FROM [Product]  WHERE [Category] IN (" & CateStr & ") OR  [OtherCategory] IN (" & CateStr & ") ORDER BY [Category] ASC, [Serial] ASC"

        DT = DB.getTable(cmd)

        If DT.Rows.Count > 0 Then
            For i = 0 To DT.Rows.Count - 1
                If i > 0 AndAlso DT.Rows(i - 1)("Category") <> DT.Rows(i)("Category") Then
                    prodStr &= "<li style=""width: 100%;""></li>"
                End If
                prodStr &= "<li><input type=""checkbox"" class=""CHK_Prod"" id=""CHK_" & DT.Rows(i)("id") & """ value=""" & DT.Rows(i)("id") & """><label for=""CHK_" & DT.Rows(i)("id") & """>" & DT.Rows(i)("Serial") & "</label></li>"
            Next
        End If

        cmd.Connection.Close()
        cmd.Dispose()
    End Sub
</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>零件設定適用商品</title>
    <link rel="stylesheet" href="../maintain.css" />
    <style>
        html, body {
            width:100%;
            margin: 0;
            overflow:hidden;
            font-size: 12px;
        }

        .prodList {
           list-style: none;
           padding-left: 20px;
           margin-top: 5px;
        }

         .prodList li {
          display: inline-block;
          width: 150px;
        }


        #unSelectList .cateTitle {
            font-size: 12px;
            padding-top: 5px;
            padding-left: 10px;
        }

        #noneItemMSG {
            display: none;
        }

        .PicTitle {
            text-align:left;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
     <script>
         var FieldName = '<%=FieldName%>';   //輸出容器ID
         var applyList = '<%=applyList%>'.split(',');
         var addList = '', removeList = '';                     //輸出內容

         window.onload = function () {
             $('#ADD_' + FieldName, window.parent.document).val('');
             $('#RMV_' + FieldName, window.parent.document).val('');

             if (applyList[0] == '') {
                 $('#noneItemMSG').show();
             } else {
                 for (var i = 0; applyList[i]; i++) {
                     if ($('#CHK_' + applyList[i]).length > 0) {
                         updateProd('add', applyList[i]);
                         $('#CHK_' + applyList[i]).prop('checked', true);
                     } else {
                         removeList += 'p' + applyList[i] + ',';
                     }
                 }

                 updateOutsideInfo();
             }

             $('.CHK_Prod').change(function (e) {
                 var id = $(this).attr('id').replace('CHK_', '');
                 var method = 'remove';
                 if (this.checked) {
                     method = 'add';
                 }

                 updateProd(method, id, true);
             });

             $('#BTN_unSelectList').on('click', function (e) {
                 $('#unSelectList').toggle();
                 upadte_IframeHeight();
             });

             upadte_IframeHeight();
         }
         
         // 勾選/取消勾選商品 
         function updateProd(method, id, transaction) {
             var $item = $('#CHK_' + id).parent();
             if (method == 'add') {
                 if (transaction) {
                     addList += 'p' + id + ',';
                     removeList = removeList.replace('p' + id + ',', '');
                 }
                 $item.appendTo('#selectList');
                 $('#noneItemMSG').hide();
             } else {
                 if (transaction) {
                     addList =  addList.replace('p' + id + ',', '');
                     removeList += 'p' + id + ',';
                 }
                 $item.appendTo('#unSelectList');
                 if ($('#selectList li').length <= 1) {
                     $('#noneItemMSG').show();
                 }
             }

             if (transaction) {
                 upadte_IframeHeight();
                 updateOutsideInfo();
             }
         }

        //更新父層的iframe高
        function upadte_IframeHeight() {
            var bodyHeight = $('body').height();
            $('#<%=targetFrame%>', window.parent.document).height(bodyHeight + 'px');
        }

         //更新外部值
         function updateOutsideInfo() {
             $('#ADD_' + FieldName, window.parent.document).val(addList.replace(/p/g, ''));
             $('#RMV_' + FieldName, window.parent.document).val(removeList.replace(/p/g, ''));
         }
    </script>
</head>
<body>
    <div class="PicTitle"><div style="padding:0 20px;">已選列表</div></div>

        <ul id="selectList" class="prodList">
            <li id="noneItemMSG">尚未選取任何適用商品</li>
        </ul>

    <div id="BTN_unSelectList" class="PicTitle"><div style="padding:0 20px; display:inline;">未選列表</div><span style="opacity:.7;">(可點擊展開/收闔)</span></div>
    <ul  id="unSelectList" class="prodList">
        <%=prodStr %>
    </ul>
</body>
</html>
