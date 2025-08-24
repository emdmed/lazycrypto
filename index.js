#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import updateNotifier from 'update-notifier';
import { createRequire } from 'module';
import App from './components/App.js';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

const notifier = updateNotifier({
    pkg: packageJson,
    updateCheckInterval: 1000 * 60 * 60 * 24,
});

notifier.notify({
    defer: false,
    message: `Update available {currentVersion} → {latestVersion}\nRun \`npm install -g ${packageJson.name}\` to update`
});

render(React.createElement(App));