class Vertex:
    graph = []

    def generate_graph(self, vertex):
        self.graph = []
        self.graph = [[] for i in range(vertex)]

    def getGraph(self):
        return self.graph