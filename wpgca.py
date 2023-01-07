class Graph:
    graphList = []
    steps = []
    vv = []

    def add_edge(self, adj, v, w):
        adj[v].append(w)
        adj[w].append(v)
        self.graphList = adj
        return adj

    # degrees of graph, and sort them in descending order

    def find_degree(self, graph):
        deg_vertices = []
        for i in range(0, len(graph)):
            deg_vertices.append((i, len(graph[i])))
        return sorted(deg_vertices, key=lambda deg_ver: deg_ver[1], reverse=True)

    def check(self, vertices, upper_limit, vertex_b, graph):
        for i in range(0, upper_limit):
            if vertex_b in graph[vertices[i]]:
                return True
        return False

    def welsh_powell_graph_colouring_algorithm(self, graph, deg_ver):
        # sorted vertices wpgca setp-2
        self.steps = []
        vertices = []
        sort_vertices = []
        # color as number
        colors = 0
        vertices_with_colors = []
        dont_color_vertices = []
        colored_vertices = []
        colored_vertices_per_iter = []

        for i in range(0, len(graph)):
            vertices.append(deg_ver[i][0])
            sort_vertices.append(deg_ver[i][0])

        while len(vertices) > 0:
            for i in range(0, len(vertices)):
                if i > 0 and self.check(vertices, i, vertices[i], graph):
                    dont_color_vertices.append(vertices[i])
                else:
                    vertices_with_colors.append((vertices[i], colors))
                    colored_vertices.append(vertices[i])
                    colored_vertices_per_iter.append((vertices[i], colors))

            print("Vertices: ", vertices)
            self.steps.append({"Vertices": vertices.copy(
            ), "Colored vertices (v, c): ": colored_vertices_per_iter.copy()})
            print("Colored vertices (v, c): ", colored_vertices_per_iter)

            for i in range(0, len(colored_vertices)):
                vertices.remove(colored_vertices[i])
            colored_vertices = []
            colored_vertices_per_iter = []
            colors += 1
        print("Vertices with colors (v, c): ", vertices_with_colors)
        print("Total color need: ", colors)
        print(self.steps)
        return {"vertices_with_colors": vertices_with_colors, "total_colors": colors, "steps": self.steps, "sorted_vertices(first)": sort_vertices}

    def getGraphList(self):
        return self.graphList


# Driver Code
if __name__ == '__main__':
    g = [[] for i in range(13)]
    wp = Graph()
    g = wp.add_edge(g, 7, 8)
    g = wp.add_edge(g, 8, 9)
    g = wp.add_edge(g, 9, 10)
    g = wp.add_edge(g, 10, 11)
    g = wp.add_edge(g, 11, 12)
    wp.welsh_powell_graph_colouring_algorithm(g, wp.find_degree(g))
