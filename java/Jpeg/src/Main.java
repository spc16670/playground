import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;

public class Main {

	public static void main(String[] args) {
		String report = examine("rose1.jpg");
		System.out.println(report);
	}

	private static String examine(String filePath) {
		StringBuilder sb = new StringBuilder();
		try {
			byte[] file = Files.readAllBytes(new File(filePath).toPath());
			sb.append("Starting tag (should be FFD8): " + toHexString(file[0]) + toHexString(file[1]) + "\n");
			sb.append("APP0 marker (should be FFE0):" + toHexString(file[2]) + toHexString(file[3]) + "\n");
			sb.append("Length:" + toHexString(file[4]) + toHexString(file[5]) + "\n");
			sb.append("Identifier:" + (char)file[6] + (char)file[7] + (char)file[8] + (char)file[9] + "\n");
			sb.append("Version (major):"+ toHexString(file[10]) + "\n");
			sb.append("Version (minor):"+ toHexString(file[11]) + "\n");
			sb.append("Density (0 - No units, 1 pixel per inch, 2 pixels per cm):" + toHexString(file[12]) + "\n");
			
			for (int i=0; i<file.length; i++) {
				if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xD8) {
					sb.append(String.format("Found FFD8 tag (Start of image). Pos: %d %n", i));
				} else if ( byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xE0) {
					sb.append(String.format("Found FFE0 tag (JPEG file identifier). Pos: %d %n", i));
                    int val = (file[i + 2] << 8) + file[i + 3];
					sb.append(String.format("Length: %d %n", val));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xC0) {
                	sb.append(String.format("JPEG: Found FFC0 tag (Start Of Frame (Baseline DCT)). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xC2) {
                	sb.append(String.format("JPEG: Found FFC2 tag (Start Of Frame (Progressive DCT)). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xC4) {
                	sb.append(String.format("JPEG: Found FFC4 tag (Huffman Table). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xDB) {
                	sb.append(String.format("JPEG: Found FFDB tag (Quantization Table). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xDD) {
                	sb.append(String.format("JPEG: Found FFC2 tag (Define Restart Interval). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xDA) {
                	sb.append(String.format("JPEG: Found FFDA tag (Start Of Scan). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xFE) {
                	sb.append(String.format("JPEG: Found FFDE tag (Comment). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0xD9) {
                	sb.append(String.format("JPEG: Found FFD9 tag (End of image). Pos: %d, Segment: %d %n", i, (int)i / 512));
                } else if (byteToHex(file[i]) == 0xFF && byteToHex(file[i + 1]) == 0x00) {
                	sb.append(String.format("JPEG: Found FF00 stuffed FF (Likely Huffman Coding). Pos: %d, Segment: %d %n", i, (int)i / 512));
                }
			}
		} catch (NoSuchFileException e) {
			sb.append("File not found.");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}

	private static int byteToHex(byte b) {
		return b & 0xFF;
	}
	
	private static String toHexString(byte b) {
		return String.format("%02x", b).toUpperCase();
	}
	
	private static int toInt(byte hb, byte lb) {
		return ((int)hb << 8) | ((int)lb & 0xFF);
	}
	
	private static int intToHex(int n) {
		  return Integer.valueOf(String.valueOf(n), 16);
	}
	
}
