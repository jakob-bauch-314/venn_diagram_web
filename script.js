
class Color{
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toString(){
        return(`rgba(${Math.floor(this.r)}, ${Math.floor(this.g)}, ${Math.floor(this.b)}, ${this.a})`)
    }
}

function Rainbow(a){
    return new Color(
        255 * (0.5 + 0.5 * Math.cos(a + (0/3) * Math.PI)),
        255 * (0.5 + 0.5 * Math.cos(a + (2/3) * Math.PI)),
        255 * (0.5 + 0.5 * Math.cos(a + (4/3) * Math.PI)),
        0.3
    )
}

//

const phi = (1+Math.sqrt(5))/2;  //goldener Schnitt
const g = 2 * Math.PI*(1-(1/phi))    //goldener Winkel 

class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    Scale(k){
        return new Vector2(this.x * k, this.y * k);
    }
    Add(v){
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    static zero = new Vector2(0, 0);
}

//

const r = 170;
const x = new Vector2(1, 0).Scale(r);                     //Einheitsvektor x
const y = new Vector2(-1/2, 1/2 * Math.sqrt(3)).Scale(r); //Einheitsvektor y
const t = new Vector2(3, 2).Scale(r);                     //Verschiebungsvektor

function Path(n){

    myColor = Rainbow(n * g).toString();

    switch(n){
        case 0:
            center = t;
            data = `M${center.x},${center.y}m${-r},0a${r},${r},0,1,0${r * 2},0 a${r},${r},0,1,0${-r * 2},0`;
            break;
        case 1:
            center = t.Add(y);
            data = `M${center.x},${center.y}m${-r},0a${r},${r},0,1,0${r * 2},0 a${r},${r},0,1,0${-r * 2},0`;
            break;
        case 2:
            center = t.Add(y).Add(x);
            data = `M${center.x},${center.y}m${-r},0a${r},${r},0,1,0${r * 2},0 a${r},${r},0,1,0${-r * 2},0`;
            break;
        default:
            function up(l, size){
                low = size>>1;
                if (l == 0) return down(l, 2);
                if (l >= low) return down(l - low, low) + low;
                else return up(l, low)
            }
            
            function down(l, size){
                return (size-1) - l;
            }

            size = 1<<(n - 2);
            m = 0;
            l = (2 * m + 1)/size;
            vx = x.Scale(l).Add(t);
            vy = y.Scale(l).Add(t);
            data = `M${Math.floor(vy.x)},${Math.floor(vy.y)}`;

            for (i = 0; i < (size>>1); i++){
                old_l = l;
                m = up(m, size); l = (2 * m + 1)/size;
                vx = x.Scale(l).Add(t);
                vy = y.Scale(l).Add(t);
                r0 = (l - old_l)*(r/2);
                r1 = Math.floor(Math.abs(r0));
                r2 = l * r
                if (r0 < 0) dir = 1; else dir = 0;

                data += `
                    A${r1},${r1},0,0,${dir},${Math.floor(vy.x)},${Math.floor(vy.y)}
                    A${r2},${r2},0,0,0,${Math.floor(vx.x)},${Math.floor(vx.y)}
                `

                old_l = l;
                m = down(m, size); l = (2 * m + 1)/size;
                vx = x.Scale(l).Add(t);
                vy = y.Scale(l).Add(t);
                r0 = (l - old_l)*(r/2);
                r1 = Math.floor(Math.abs(r0));
                r2 = l * r
                if (r0 < 0) dir = 0; else dir = 1;

                data += `
                    A${r1},${r1},0,0,${dir},${Math.floor(vx.x)},${Math.floor(vx.y)}
                    A${r2},${r2},0,0,1,${Math.floor(vy.x)},${Math.floor(vy.y)}
                `
            }
    }

    return `<path id = "${n}" class="set" style = "fill: ${myColor.toString()}" d = "${data}"/>`
}

//

const diagram = document.getElementById("diagram");
const msg = document.getElementById("msg");
const number = document.getElementById("number");

diagram.setAttribute("width", 6 * r);
diagram.setAttribute("height", 5 * r);

function Update(){

    content = number.value;
    myNumber = parseInt(content);

    if (isNaN(myNumber)){
        msg.innerHTML = " ):<"
        msg.setAttribute("style", "color: pink")
        return;
    } else if (myNumber == 69){
        msg.innerHTML = " ( ͡° ͜ʖ ͡°)"
        msg.removeAttribute("style")
        return;
    } else if (myNumber == 420){
        msg.innerHTML = "🥦"
        msg.removeAttribute("style")
        return;
    } else if (myNumber < 0){
        msg.innerHTML = " (:"
        msg.setAttribute("style", "color: lightgreen")
    } else if (myNumber > 15){
        msg.innerHTML = " wird wahrscheinlich laggen /:"
        msg.setAttribute("style", "color: pink")
        return;
    } else {
        msg.innerHTML = " :)"
        msg.setAttribute("style", "color: lightgreen")
    }

    diagram.innerHTML = "";
    for (n = 0; n < myNumber; n++){
        diagram.innerHTML += Path(n); 
    }
}

Update();