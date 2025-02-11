<div align="center">
    <h1>Chitogefy Rest API</h1>
    <img
        src="https://i.pinimg.com/736x/4f/2c/dc/4f2cdcde44b5f7d66ccbd69753aeb931.jpg"
        alt="Chitoge"
        style="border-radius: 10px; max-width: 65%; height: auto;"
    />
</div>

## Simple REST API Base

This repository provides a simple template for creating a REST API using Fastify. It includes basic setup instructions, configuration options, and licensing information.

# Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Requirements
To get Chitogefy up and running, ensure you have:

- [Node.js](https://nodejs.org/en/download/) v20 or higher
- [Git](https://git-scm.com/downloads)
- [NPM](https://www.npmjs.com/get-npm)

## Installation

1. **Clone the repository**
   - Clone the repository from the desired branch:
     - For CommonJS (CJS) setup (default), clone the `main` branch:
       ```sh
       git clone -b main https://github.com/Suryanjana/Chitoge.git
       ```
     - For ECMAScript Modules (ESM) setup, clone the `dev` branch:
       ```sh
       git clone -b dev https://github.com/Suryanjana/Chitoge.git
       ```
2. **Install the dependencies**
   ```sh
   npm install
   ```
3. **Create or rename the .env.example file to .env**
   ```sh
   PORT=8080
   ```

4. **Run the application:**

   `node src/server.js` / `npm start` / `yarn start`

   or using [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/):

   ```sh
   pm2 start server.js
   pm2 logs API
   ```

   Setting name at [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)



## Contributing

You can contribute to the development of this project by submitting a pull request. If you find any bugs, please report them by creating an issue.

1. Fork the repository.
2. Create a new branch **(git checkout -b feature/feature-name)**.
3. Implement your changes.
4. Commit **(git commit -am 'Add some feature')**.
5. Push to your branch **(git push origin feature/feature-name)**.
6. Submit a Pull Request.
7. Await review and merging.


## License

This project is licensed under the [MIT License](LICENSE).

### Key Changes:

1. **Branch information added**: I added the note about the `main` branch using CJS and the `dev` branch using ESM in the installation section. This ensures users know which branch to choose based on their setup.
2. **Clearer instructions**: Added commands and steps clearly with explanations on using either `main` or `dev` branches.
3. **Formatting consistency**: Maintained uniform formatting throughout the document, especially with the command blocks and text descriptions.

Let me know if you'd like any more adjustments!
