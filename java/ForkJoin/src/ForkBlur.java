import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

import javax.imageio.ImageIO;

public class ForkBlur extends RecursiveAction {
	
	/* The sThreshold value determines whether the blurring will be performed 
	 * directly or split into two tasks.
	 */
	
	protected static int sThreshold = 10000;
	
	private int[] mSource;
	private int mStart;
	private int mLength;
	private int[] mDestination;
	private int mBlurWidth = 15;
	
	public ForkBlur(int[] src, int start, int length, int[] dst) {
		this.mSource = src;
		this.mStart = start;
		this.mLength = length;
		this.mDestination = dst;
	}

	public static void main(String[] args) {
		try {
			String fileName = "rose1.jpg";
			File srcFile = new File(fileName);
			BufferedImage image = ImageIO.read(srcFile);
			BufferedImage blurredImage = blur(image);
			
			String dstName = "blurred-" + fileName;
			File dstFile = new File(dstName);

			ImageIO.write(blurredImage,"jpg",dstFile);
			System.out.println("Complete");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static BufferedImage blur(BufferedImage srcImage) {
		int w = srcImage.getWidth();
		int h = srcImage.getHeight();
		//Sets an array of integer pixels in the default RGB color model (TYPE_INT_ARGB) and default sRGB color space, into a portion of the image data.
		int[] src = srcImage.getRGB(0, 0, w, h, null, 0, w);
		int[] dst = new int[src.length];
		//int cores = Runtime.getRuntime().availableProcessors();
		ForkBlur fb = new ForkBlur(src, 0, dst.length, dst);
		ForkJoinPool pool = new ForkJoinPool();
		long startTime = System.currentTimeMillis();
		pool.invoke(fb);
		long endTime = System.currentTimeMillis();
		System.err.println("Blur operation took " + (endTime - startTime));
		BufferedImage dstImage = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
		dstImage.setRGB(0, 0, w, h, dst, 0, w);
		return dstImage;
	}

	
	protected void computeDirectly() {
		int sidePixels = (mBlurWidth - 1) / 2;
		for (int index = mStart; index < mStart + mLength; index++ ) {
			
			// Calculate average
			float rt = 0;
			float gt = 0;
			float bt = 0;
			
			for (int mi = -sidePixels; mi <= sidePixels; mi++) {
				int mindex = Math.min(Math.max(mi + index, 0), mSource.length - 1);
				int pixel = mSource[mindex];
				rt += (float) ( (pixel & 0x00ff0000) >> 16 ) / mBlurWidth;
				gt += (float) ( (pixel & 0x0000ff00) >> 8 ) / mBlurWidth;
				bt += (float) ( (pixel & 0x000000ff) >> 0 ) / mBlurWidth;
			}
			
			// Re-assemble destination pixel
			int dpixel = ( 0xff000000 ) 
					| (((int) rt ) << 16 )
					| (((int) gt ) << 8 )
					| (((int) bt ) << 0 );
			
			mDestination[index] = dpixel;
			
		}
		
	}
	
	@Override
	protected void compute() {
		if (mLength < sThreshold) {
			System.out.println("Computing directly " + Thread.currentThread().getName());
			computeDirectly();
			return;
		}
		int split = mLength /2;
		invokeAll(
				new ForkBlur(mSource,mStart,split,mDestination)
				, new ForkBlur(mSource, mStart + split, mLength - split, mDestination)
		);
	}
	

}
