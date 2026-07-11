# Ollama UI Wapper

  A simple Ollama UI wrapper to use your Ollama Local LLM. The UI Wrapper will fetch local LLM automatically and you can use whatever model you want.



  ## How to setup

  - git clone

  ```
    git clone https://github.com/Magesh-sam/ollama-ui-wrapper.git
  ```

- Change Directory

``` 
    cd ollama-ui-wrapper
```

- Install dependencies

```
    pnpm i
```
 - Expose your Ollama API

```
   ollama serve 
```
 - Add your API url to .env file

    eg: VITE_API_URL=http://localhost:11434/api

- Run the application
```
    pnpm run dev
```

**Don't forget to add .env file to .gitignore file**