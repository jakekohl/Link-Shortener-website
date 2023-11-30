# Database Directory
This database directory acts as a standalone basic storage method for reducing the amount of API calls to the bit.ly service. 

## Contents

By default, this repo will contain this directory and the database.md file. When generating a bit.ly link for the first time, it will generate a file called 'urlCache.json' that will be a plaintext json file to store short links you have already created. The .gitignore file is setup to ignore this file, so you don't commit this to source control.