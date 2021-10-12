# fenstella
This project relies on AWS Amplify. In order to get this project to work you will need an AWS account.

## Install global Amplify CLI
```
npm install -g @aws-amplify/cli
```

## Configure Amplify
```
amplify configure
```
Follow the steps here 
https://docs.amplify.aws/cli/start/install/#option-2-follow-the-instructions


## Project setup
```
npm install
```

## Init Amplify
```
amplify init
```
Follow the steps for JS Vue project.

After that the file `aws-exports.js` will be created in the root directory of the project. 
This file contains important configurations for AWS resources.

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Release on AWS
```
amplify push
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
