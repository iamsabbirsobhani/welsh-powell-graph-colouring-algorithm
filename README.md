# Welsh Powell Graph colouring Algorithm

This project is the implementation of **Welsh Powell Graph colouring Algorithm** with live interaction visually.

Graph coloring is a concept of computer science, where two adjacent `nodes` can not have the same color. They have to color with different colors. So, to implement this concept, computer scientists have given some algorithms. Most of them are very effective and have lower time complexity. And, **Welsh Powell Graph colouring Algorithm** is one of them. It is very effective, less time complexity and the algorithmic process is notably lucid.

> An example of the **Welsh Powell Graph colouring Algorithm** with 3 nodes coloring.
> ![Graph coloring](/welsh-powell-graph-colouring-algorithm-ui//2023-01-07.png)

## Developer

1. Clone the repo

```
git clone https://github.com/iamsabbirsobhani/welsh-powell-graph-colouring-algorithm
```

2.  Create a python virtual environment(optional)

    1. Windows
       ```
       py -m venv env
       ```
       Activating the virtual environment.
       ```
       .\env\Scripts\activate
       ```
    2. Unix/macOS
       ```
       python3 -m venv env
       ```
       Activating the virtual environment.
       ```
       source env/bin/activate
       ```
       [Details about Installing packages using pip and python virtual environments](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/#installing-packages-using-pip-and-virtual-environments)

3.  Install all the required packages

    From the `requirements.txt`, install all the necessary packages.

    1. Windows

    ```
    pip install -r requirements.txt
    ```

    2. Unix/macOS

    ```
    pip3 install -r requirements.txt
    ```

4.  Run the app!
    1. Windows
    ```
    python app.py
    ```
    2. Unix/macOS
    ```
    python3 app.py
    ```

## Docker

With Gunicorn server. Not compatible with this app as it reset processes quickly. But, working!

```cmd
CMD ["gunicorn", "-b", ":8083", "-w", "4", "app:app"]
```

Ultimately it has been done with the default flask server.

# Technologies

| Language   | UI          | Backend Framework |
| ---------- | ----------- | ----------------- |
| Python     | HTML        | Flask             |
| JavaScript | CSS         | ∅                 |
| ∅          | TailwindCSS | ∅                 |
