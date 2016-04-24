# gofront
Simple front to be run with javago-like server running.

run `tsc --p src/typescript/tsconfig.json` to compile main javascript file, open main.html run frontend.
run `tsc --p src/typescript/tsconfig-viewer.json` to compile logs viewer, open viewer.html to run viewer.
pages can be opened after running any static file server from `content` directory, for example:
`cd directory` and `python -m SimpleHTTPServer 8000`
as in `run.sh` script.
