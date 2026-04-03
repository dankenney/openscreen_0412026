# Contribution Guidelines

Thank you for considering contributing to this project! By contributing, you help make this project better for everyone. Please take a moment to review these guidelines to ensure a smooth contribution process.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of this repository to create your own copy.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/openscreen.git
     ```

3. **Create a New Branch**
   - Create a branch for your feature or bug fix:
     ```bash
     git checkout -b feature/your-feature-name
     ```

4. **Make Changes**
   - Make your changes.

5. **Test Your Changes**
   - Test your changes thoroughly to ensure they work as expected and do not break existing functionality.

## Local Windows Packaging

- `npm run build:win` keeps the default Windows release behavior.
- If `electron-builder` fails on Windows while extracting `winCodeSign` because your shell does not have symlink privileges, use `npm run build:win:local` for an NSIS installer or `npm run build:win:local:dir` for an unpacked app directory.
- These local scripts set `win.signAndEditExecutable=false`, so they are best suited for local testing and QA rather than final release artifacts.
- Release packaging workflows stay on Node `22.22.1`. `electron-builder` currently emits an upstream `[DEP0190]` deprecation warning during packaging on Node 24, so we treat Node 22.22.1 as the stable release-build baseline for now.

6. **Commit Your Changes**
   - Commit your changes with a clear and concise commit message:
     ```bash
     git add .
     git commit -m "Add a brief description of your changes"
     ```

7. **Push Your Changes**
   - Push your branch to your forked repository:
     ```bash
     git push origin feature/your-feature-name
     ```

8. **Open a Pull Request**
   - Go to the original repository and open a pull request from your branch. Provide a clear description of your changes and the problem they solve.

## Reporting Issues

If you encounter a bug or have a feature request, please open an issue in the [Issues](https://github.com/siddharthvaddem/openscreen/issues) section of this repository. Provide as much detail as possible to help us address the issue effectively.

## Style Guide

- Write clear, concise, and descriptive commit messages.
- Include comments where necessary to explain complex code.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

Thank you for your contributions!
