import webview
import os

class API:
    def hello(self):
        return "Hello from Python!"

def main():
    api = API()
    # In development, we load the Vite dev server
    # In production, we would load the index.html from dist
    window = webview.create_window(
        'Vanguard 3D',
        'http://localhost:5173',
        js_api=api
    )
    webview.start()

if __name__ == '__main__':
    main()
