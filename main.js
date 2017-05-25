$(document).ready(function() {

    var cKP = $("#kp");
    var cKI = $("#ki");
    var cKD = $("#kd");
    var cG0 = $("#g0");
    var cSP = $("#setpt");
    var cU = $("#loss");
    var cS = $("#status");
    var valid, kP, kI, kD, g0, sp, u, t;

    var data = [{
        label: "Setpoint",
        values: []
    }, {
        label: "Output",
        values: []
    }];
    var chart = $("#output").epoch({
        type: "line",
        data: data
    });

    function update() {
        valid = true;
        var update = false;
        try {
            var temp;
            temp = parseFloat(cKP.val());
            if (temp !== kP) {
                kP = temp;
                update = true;
            }
            temp = parseFloat(cKI.val());
            if (temp !== kI) {
                kI = temp;
                update = true;
            }
            temp = parseFloat(cKD.val());
            if (temp !== kD) {
                kD = temp;
                update = true;
            }
            temp = parseFloat(cG0.val());
            if (temp !== g0) {
                g0 = temp;
                update = true;
            }
            temp = parseFloat(cSP.val());
            if (temp !== sp) {
                sp = temp;
                update = true;
            }
            temp = parseFloat(cU.val());
            if (temp !== u) {
                u = temp;
                update = true;
            }
        } catch (e) {
            valid = false;
            console.log(e);
        }
        if (!valid)
            cS.text("Invalid input!");
        else
            cS.text("");
        if (update) {
            for (var i2 = 0; i2 < 101; i2++)
                data[0].values[i2] = {x: i2 * 0.1, y: sp};
            var ei = sp - g0;
            var d = [g0, g0 + kP * ei + kI * ei + u * g0];
            for (var i = 1; i < 100; i++) {
                var e = sp - d[i];
                var integ = 0;
                for (var j = 0; j < d.length; j++)
                    integ += sp - d[j];
                d.push(d[i] + kP * e + kI * integ + kD * (e - (sp - d[i - 1])) / 0.1 + u * d[i]);
            }
            for (var i3 = 0; i3 < 101; i3++)
                data[1].values[i3] = {x: i3 * 0.1, y: d[i3]};
            console.log(data);
            chart.update(data);
            console.log("Weather update: " + new Date().getTime())
        }
    }

    update();

    cKP.bind("keyup mouseup", update);
    cKI.bind("keyup mouseup", update);
    cKD.bind("keyup mouseup", update);
    cG0.bind("keyup mouseup", update);
    cSP.bind("keyup mouseup", update);
    cU.bind("keyup mouseup", update);

});