let _data = { "Hs": [{ "Prm1": "2022-10-22 00:20:36", "Prm2": "阴性", "Prm3": null, "Prm4": null }], "Ym": [{ "Prm1": "2022-02-12", "Prm2": "第3针", "Prm3": null, "Prm4": null }, { "Prm1": "2021-07-27", "Prm2": "第2针", "Prm3": null, "Prm4": null }, { "Prm1": "2021-07-03", "Prm2": "第1针", "Prm3": null, "Prm4": null }], "Jkm": [{ "Prm1": "2022-10-06 09:45:49", "Prm2": "杭州市", "Prm3": "绿码", "Prm4": null }, { "Prm1": "2021-07-28 14:43:00", "Prm2": "衢州市", "Prm3": "绿码", "Prm4": null }, { "Prm1": "2021-02-10 16:04:58", "Prm2": "金华市", "Prm3": "绿码", "Prm4": null }], "Txm": [{ "Prm1": "2022-09-02", "Prm2": "2023-01-06", "Prm3": "启用", "Prm4": null }], "Xcm": [] };
$(() => {
    $("html").css("background-color", "#b8e8f9");
    getTime();
    setInterval(() => {
        getTime();
    }, 1000);
    // 定时刷新页面
    //setTimeout(()=>{
    //    location.reload();
    //},1000 * 60)

});
function getTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (hour.toString().length < 2)
        hour = "0" + hour;
    if (minute.toString().length < 2)
        minute = "0" + minute;
    if (second.toString().length < 2)
        second = "0" + second;

    $("#sj").text(month + "月" + day + "日  " + hour + ":" + minute + ":" + second);
    if (month.toString().length < 2)
        month = "0" + month;
    $("#_hs").text(month + "-" + day + "  " + "00" + ":" + "13");
}
function GetInfo(tag) {
    let info = eval("_data." + tag);
    var html = "<div class='tips-info'>";
    if (tag == 'Hs') {
        html += "<div class='tips-title'><div>核酸检测时间</div><div>结果</div></div>";
    }
    if (tag == 'Ym') {
        html += "<div class='tips-title'><div>疫苗接种时间</div><div>针数</div></div>";
    }
    if (tag == 'Jkm') {
        html += "<div class='tips-title'><div>最近更新时间</div><div>码发放地</div><div>码状态</div></div>";
    }
    if (tag == 'Txm') {
        html += "<div class='tips-title'><div>开始时间</div><div>结束时间</div><div>状态</div></div>";
    }
    for (let i = 0; i < info.length; i++) {
        html += `<div class='tips-content'>`
            + `<div>` + info[i].Prm1 + `</div>`
            + `<div>` + info[i].Prm2 + `</div>`
            + (info[i].Prm3 == null ? `` : "<div>" + info[i].Prm3 + "</div>")
            + `</div>`;
    }
    //if (tag == 'Jkm') {
    //    html += '<span style="color:blue;font-size:40px;text-decoration:underline;" onclick="handle_refresh()">点击刷新健康码信息<span>';
    //}
    html += "</div>"
    alertOpen(html);
}
let lOpen;
//弹出内容
function alertOpen(html) {
    lOpen = layer.open({
        shadeClose: true
        , content: html
        , anim: 'up'
        , style: 'position:fixed; left:3%; top:500px; width:94%; height:700px; border: none; -webkit-animation-duration: .5s; animation-duration: .5s; border-radius: 25px;'
    })
}
function alertTips(content) {
    //提示
    layer.open({
        content: "<span style='font-size: 35px;'>" + content + "</span>"
        , skin: 'msg'
        , time: 2 //2秒后自动关闭
    });
}
//32位随机字符串
function getGuid() {
    var oStr = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', oChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', len = oChar.length;
    return oStr.replace(/x/g, (match) => {
        return oChar.charAt(Math.floor(Math.random() * len));
    });
}
//获取验证码
function getCode() {
    let sjh = $('.layui-m-layercont').find("input[name='sjh']").eq(0).val();
    if (!isPhoneNum(sjh)) {
        alertTips("请输入正确的手机号码！！");
        return;
    }
    let queryId = getGuid();
    $("#queryId").val(queryId);
    let sendTime = "2022-11-12 12:44:45";
    $("#sendTime").val(sendTime);
    let timeNum = 60, setText = (start) => {
        let btn = $('.layui-m-layercont').find("span[name='btn_yzm']").eq(0);
        btn.html(start ? timeNum : --timeNum);
        btn.addClass("disabled2");

        if (timeNum <= 0) {
            clearInterval(this.timer);
            btn.removeClass("disabled2");
            btn.html("重新获取");
        };
    };
    setText(!0);
    this.timer = setInterval(setText, 1000);

    let loadingOpen;
    $.ajax({
        url: "/AdultPass/GetVerification",
        type: "POST",
        data: {
            sjh: sjh,
            queryId: queryId,
            sendTime: sendTime
        },
        beforeSend: () => {
            loadingOpen = layer.open({ type: 2 });
        },
        success: (ret, status) => {
            layer.close(loadingOpen);
            if (status == "success" && ret && ret.code == '00') {
                try {
                    let datas = JSON.parse(ret.datas);
                    if (datas && datas.code == 200) {
                        if (datas.data && datas.data.code == '00' && datas.data.result) {
                            alertTips(datas.data.result);
                        } else {
                            alertTips(datas.data.errorDesc);
                        }
                    }
                    else {
                        alertTips("短信发送失败！");
                    }
                } catch (e) {
                    alertTips("短信发送失败！");
                }
            }
            else {
                alertTips("短信发送失败！");
            }
        },
        error: function (obj) {
            layer.close(loadingOpen);
            alertTips("短信发送失败！");
        },
        dataType: "json",
        async: true
    });
}
function getXcm() {
    let sjh = $('.layui-m-layercont').find("input[name='sjh']").eq(0).val();
    let yzm = $('.layui-m-layercont').find("input[name='yzm']").eq(0).val();
    let queryId = $("#queryId").val() == '' ? getGuid() : $("#queryId").val();
    let sendTime = $("#sendTime").val() == '' ? "2022-11-12 12:44:45" : $("#sendTime").val();

    if (!isPhoneNum(sjh)) {
        alertTips("请输入正确的手机号码！！");
        return;
    }
    if (!(yzm && yzm.length == 6)) {
        alertTips("请输入正确的短信验证码！！");
        return;
    }
    let loadingOpen;
    $.ajax({
        url: "/AdultPass/GetXcm",
        type: "POST",
        data: {
            sjh: sjh,
            queryId: queryId,
            sendTime: sendTime,
            verification: yzm
        },
        beforeSend: () => {
            loadingOpen = layer.open({ type: 2 });
        },
        success: (ret, status) => {
            layer.close(loadingOpen);
            if (status == "success" && ret && ret.code == '00') {
                try {
                    let datas = JSON.parse(ret.datas);
                    if (datas && datas.code == 200) {
                        if (datas.data && datas.data.code == '00' && datas.data.result) {
                            alertTips("查询成功！");
                            let _hy = $("#xcm-hy");
                            let _h = `<div class="xcm-jg">` + (datas.data.result.value == "1" ? "更新时间：2022-11-12" : (datas.data.result.value == "2" ? "途经中高风险地区" : "没有行程记录")) + `</div>`;
                            _hy.html(_h);
                            $(".xcm-top-img>img").attr("src", (datas.data.result.value == "1" ? "img/go.png" : (datas.data.result.value == "2" ? "img/notgo.png" : "img/isgo.png")))
                            layer.close(lOpen);
                            $.post("/AdultPass/InsertXcm", {
                                sjh: sjh,
                                sendTime: sendTime,
                                jg: datas.data.result.value
                            });
                        } else {
                            alertTips(datas.data.errorDesc);
                        }
                    } else {
                        alertTips("查询数据失败！！");
                    }
                } catch (e) {
                    alertTips("查询数据失败！");
                }
            } else {
                alertTips("查询数据失败！");
            }
        },
        error: function (obj) {
            layer.close(loadingOpen);
            alertTips("查询数据失败！");
        },
        dataType: "json",
        async: true
    });
}
//授权
function isCheck(e) {
    if (e.checked) {
        $('.layui-m-layercont').find(".hy-cx").eq(0).removeClass("disabled1");
    } else {
        $('.layui-m-layercont').find(".hy-cx").eq(0).addClass("disabled1");
    }
}
//手机号码 正则
function isPhoneNum(phone) {
    var reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    return reg.test(phone);
}
//刷新健康码
function refreshJkm() {
    $.ajax({
        url: "/TchPassCode/RefreshJkm",
        type: "POST",
        success: function (msgBody) {
            var data = $.parseJSON(msgBody);
            if (data.Code == 1) {
                alertTips(data.Message);
                setTimeout(() => { location.reload() }, 500);
            }
            else {
                alertTips(data.Message);
            }
        }
    })
}
const handle_refresh = debounce(() => {
    refreshJkm();
}, 1000);
/*
 * fn [function] 需要防抖的函数
 * delay [number] 毫秒，防抖期限值
 */
function debounce(fn, delay) {
    let timer = null; //借助闭包
    return function () {
        if (timer) {
            clearTimeout(timer); //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
            timer = setTimeout(fn, delay);
        } else {
            timer = setTimeout(fn, delay); // 进入该分支说明当前并没有在计时，那么就开始一个计时
        }
    };
}
