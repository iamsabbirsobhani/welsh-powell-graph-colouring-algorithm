const plotArea = document.getElementById("plot-area");
const popupCondition = document.getElementById("popup-condition");
const form = document.querySelector("form");
const run = document.getElementById("run");
const reset = document.getElementById("reset");
const begin = document.getElementById("begin");
const output = document.getElementById("output");
const totalColorsMsg = document.getElementById("total-colors-msg");

// plotArea.hidden = true;

// task: straightlines add different color for different edges
function edge(circleFrom, circleTo) {
    let y1 = circleFrom.offsetTop + circleFrom.offsetHeight;
    let y2 = circleTo.offsetTop;
    let x1 = circleFrom.offsetLeft + circleFrom.offsetWidth;
    let x2 = circleTo.offsetLeft + circleTo.offsetWidth;
    let angle = Math.atan2((circleFrom.offsetTop - y2), (x1 - x2)) * (180 / Math.PI);
    let length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (5 / 2);

    let straightLine = document.createElement('div');
    straightLine.id = 'straightLine';
    plotArea.append(straightLine);

    straightLine.style.left = cx - 20 + 'px';
    straightLine.style.top = cy + "px"
    straightLine.style.width = length - 5 + "px"
    straightLine.style.transform = `rotate(${angle}deg)`
    straightLine.style.transition = `all 4s`
}


function generateGraphNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if (i % 2 === 0) {
            let circleFrom = document.createElement("div");
            circleFrom.id = `circleFrom-${i}`
            circleFrom.className = `nodecircle nodecircle-even`
            circleFrom.innerHTML = `<p class="nodeName flex justify-center items-center font-bold absolute left-0 right-0 top-0 bottom-0 m-auto text-white text-xl">${i}</p>`
            plotArea.append(circleFrom)
        } else {
            let circleTo = document.createElement("div");
            circleTo.id = `circleTo-${i}`
            circleTo.className = `nodecircle nodecircle-odd`
            circleTo.innerHTML = `<p class="nodeName flex justify-center items-center font-bold absolute left-0 right-0 top-0 bottom-0 m-auto text-white text-xl">${i}</p>`
            plotArea.append(circleTo)
        }

    }

    // connectEdge(nodes)
    plotArea.childNodes.forEach((element, index) => {
        if (element.classList[0] === "nodecircle") {
            // circleNodes can be drag
            element.draggable = true

            element.addEventListener('click', e => {
                clickPair.push(e.target.innerText)
                if (clickPair.length > 2) {
                    clickPair = []
                    clickPair.push(e.target.innerText)
                }

                plotArea.childNodes.forEach((element, index) => {
                    if (element.classList[0] === "nodecircle") {
                        if (clickPair.includes(element.innerText)) {
                            element.classList += " active"
                            if (clickPair.length == 2) {
                                setTimeout(() => {
                                    element.classList.remove("active")
                                }, 1000);
                            }
                        } else {
                            element.classList.remove("active")
                        }
                    }
                })
                if (clickPair.length === 2) {
                    postVerticesPair(clickPair)
                }
            })
        }
    })
}

function connectEdge(connectionList) {
    for (let i = 0; i < connectionList.length; i++) {
        for (let j = 0; j < connectionList[i].length; j++) {
            edge(plotArea.childNodes[i], plotArea.childNodes[connectionList[i][j]])
        }
    }
}

let clickPair = []

function postVerticesPair(vertices) {

    document.body.appendChild(loading())

    var data = JSON.stringify({
        "vertexPair": vertices
    });

    var config = {
        method: 'post',
        url: 'https://wpgc.azurewebsites.net/api/v1/graph',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            if (response.data.status === true) {
                document.getElementById("loading").remove()
                // remove all the  existing straightlines inside plotArea
                let straightLines = document.querySelectorAll("#straightLine")
                straightLines.forEach(element => {
                    element.remove()
                });
                // then connect the new edges
                connectEdge(response.data.graph)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

let copyOfNodes = []

function axiosGenerateGraph(n) {
    document.body.appendChild(loading())
    let config = {
        method: 'get',
        url: 'https://wpgc.azurewebsites.net/api/v1/generate-graph/' + n,
        headers: {}
    };
    axios(config)
        .then(function (response) {
            if (response.data.status === true) {
                popupCondition.remove()
                document.getElementById("loading").remove()
                copyOfNodes = response.data.graph
                generateGraphNodes(response.data.graph)
            } else {
                console.log("error")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

form.addEventListener('submit', e => {
    e.preventDefault()
    if (e.target[0].value) {
        plotArea.style.gridTemplateColumns = `repeat(${Math.ceil(e.target[0].value / 2)}, 1fr)`
        if (Math.ceil(e.target[0].value / 2) > 2) {
            plotArea.style.gridTemplateColumns = `repeat(3, 1fr)`
        } else {
            plotArea.style.gridTemplateRows = `repeat(${Math.ceil(e.target[0].value / 2)}, 1fr)`
        }
        axiosGenerateGraph(e.target[0].value)
    } else {
        console.log("empty")
    }
    e.target.reset()
})

function loading() {
    let load = document.createElement("div");
    load.id = "loading"
    load.className = "flex w-full h-full fixed left-0 right-0 bottom-0 top-0 z-50 m-auto justify-center backdrip backdrop-blur-sm items-center"
    load.innerHTML = `<div class="w-8 h-8 bg-blue-600 rounded-full">
    <div
        class=" w-8 h-8 bg-gray-50 animate-spin rounded-full border-l-transparent border-r-transparent border-b-transparent border-t-blue-500 border-[5px]">
    </div>
</div>`
    return load
}

run.addEventListener('click', e => {

    // add loading state
    document.body.appendChild(loading())

    let config = {
        method: 'get',
        url: 'https://wpgc.azurewebsites.net/api/v1/graph/chromatic-number',
        headers: {}
    };

    let colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"]

    axios(config)
        .then(function (response) {
            totalColorsMsg.innerText = "Total " + response.data.graph.total_colors + " color(s) will be needed."

            // remove loading state
            document.getElementById("loading").remove()

            plotArea.childNodes.forEach((element, index) => {
                if (element.classList[0] === "nodecircle") {
                    for (let i = 0; i < response.data.graph.vertices_with_colors?.length; i++) {
                        if (response.data.graph.vertices_with_colors[i][0] == element.innerText) {
                            element.style.backgroundColor = colors[response.data.graph.vertices_with_colors[i][1]]
                        }
                    }
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        });

    // create new shadow element to cover the plotArea after the graph is colored
    let shadow = document.createElement("div")
    shadow.classList += "shadow  backdrop-blur-0 w-full h-full absolute left-0 right-0 bottom-0 top-0 z-10 z-40"
    plotArea.appendChild(shadow)
})

reset.addEventListener('click', e => {
    totalColorsMsg.innerHTML = ""
    // remove all the  existing straightlines inside plotArea
    // empty the plotArea
    plotArea.innerHTML = ""
    axiosGenerateGraph(copyOfNodes.length)
})

begin.addEventListener('click', e => {
    totalColorsMsg.innerHTML = ""
    // emptied plotarea
    plotArea.innerHTML = ''
    // add the popup condition
    document.body.appendChild(popupCondition)

})

// disable access to the app, if the screen is smaller than 768px, show the message
if (screen.width <= 768) {
    document.getElementById("main").hidden = true
    document.getElementById("message").hidden = false
} else {
    document.getElementById("message").hidden = true
    document.getElementById("main").hidden = false
}
