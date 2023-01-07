from flask import Flask, request
from flask_cors import CORS
from wpgca import Graph
from vertex import Vertex
app = Flask(__name__, static_url_path='',
            static_folder='welsh-powell-graph-colouring-algorithm-ui',
            template_folder='welsh-powell-graph-colouring-algorithm-ui')

CORS(app)

graph = Graph()
vertex = Vertex()


@app.route('/')
def hello_world():
    return app.send_static_file('index.html')


@app.route('/api/v1/generate-graph/<int:v>', methods=['GET'])
def generateGraph(v):
    vertex.generate_graph(v)
    return {"status": True, "graph": vertex.getGraph()}, 200


@app.route('/api/v1/graph', methods=['POST'])
def api():
    if request.method == 'POST':
        g = request.get_json()
        print(g["vertexPair"][0])
        res = addEdge(vertex.getGraph(), int(g["vertexPair"][1]), int(g["vertexPair"][0]))
        return res

@app.route('/api/v1/graph/chromatic-number', methods=['GET'])
def chromaticNumber():
    if request.method == 'GET':
        return calculateChromaticNumber(vertex.getGraph())


def preventSelfLoop(vertex, value):
    if vertex != value:
        return True
    return False


def preventDuplicate(g, value, vtx):
    if value in g[vtx]:
        return True
    return False


def addEdge(g, value, vtx):
    if isEmptyGraph(g):
        return {"status": False, "message": "Graph is empty"}
    else:
        if preventDuplicate(g, value, vtx):
            return {"status": False, "message": "Edge already exists"}
        else:
            if preventSelfLoop(vtx, value):
                graph.add_edge(g, vtx, value)
                return {"status": True, "graph": graph.getGraphList()}
            else:
                return {"status": False, "message": "Self loop not allowed"}

def calculateChromaticNumber(g):
    if isEmptyGraph(g):
        return {"status": False, "message": "Graph is empty"}
    else:
        deg_ver = graph.find_degree(g)
        return {"status": True, "graph": graph.welsh_powell_graph_colouring_algorithm(g, deg_ver)}, 200


def isEmptyGraph(g):
    if len(g) <= 0:
        return True
    return False


if __name__ == '__main__':
  app.run(host='0.0.0.0')
