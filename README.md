# Batch Convert Images

A tool to batch convert PNG images to WebP format.

## Installation

```sh
npm install -g batch-convert-images
```

## Usage

```sh
batch-convert-images --input /path/to/pngs --output /path/to/webps --batch 50
```

### Options

- `--input`, `-i`: Input directory containing .png files (required)
- `--output`, `-o`: Output directory for .webp files (required)
- `--batch`, `-b`: Number of files to process in each batch (default: 100)

## License

This project is licensed under the MIT License.