use clap::Parser;
use image::{ImageBuffer, Rgba};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "transparentify")]
#[command(about = "Removes white background from images by making white-ish pixels transparent")]
struct Cli {
    /// Input image file (JPEG or PNG)
    #[arg(short, long, value_name = "FILE")]
    input: PathBuf,

    /// Output PNG file
    #[arg(short, long, value_name = "FILE")]
    output: PathBuf,

    /// Threshold for white-ish pixel detection (0-255)
    #[arg(short, long, default_value_t = 20)]
    threshold: u8,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    // Load the input image
    let img = image::open(&cli.input)
        .map_err(|e| format!("Failed to open input image: {}", e))?;

    // Convert to RGBA8
    let mut rgba_img = img.to_rgba8();

    // Get dimensions
    let (width, height) = rgba_img.dimensions();

    // Create a new image buffer for the output
    let mut output_img = ImageBuffer::new(width, height);

    // Process each pixel
    for (x, y, pixel) in rgba_img.enumerate_pixels() {
        let Rgba([r, g, b, a]) = *pixel;

        // Check if the pixel is white-ish based on threshold
        let is_white = r.saturating_sub(255 - cli.threshold) >= 255 - cli.threshold
            && g.saturating_sub(255 - cli.threshold) >= 255 - cli.threshold
            && b.saturating_sub(255 - cli.threshold) >= 255 - cli.threshold;

        // If white-ish, make it fully transparent; otherwise, keep original
        let new_pixel = if is_white {
            Rgba([r, g, b, 0])
        } else {
            Rgba([r, g, b, a])
        };

        output_img.put_pixel(x, y, new_pixel);
    }

    // Save the output image
    output_img
        .save(&cli.output)
        .map_err(|e| format!("Failed to save output image: {}", e))?;

    println!(
        "Successfully created {} with transparent background (threshold: {})",
        cli.output.display(),
        cli.threshold
    );

    Ok(())
}