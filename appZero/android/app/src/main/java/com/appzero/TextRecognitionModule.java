package com.appzero;

import android.net.Uri;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.Text;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.io.IOException;
import java.util.List;

public class TextRecognitionModule extends ReactContextBaseJavaModule {

    private static final String TAG = "TextRecognitionModule";

    public TextRecognitionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "TextRecognitionModule";
    }

    @ReactMethod
    public void recognizeImage(String url, final Promise promise) {
        Uri uri = Uri.parse(url);
        InputImage image;
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri);

            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(image)
                    .addOnSuccessListener(new OnSuccessListener<Text>() {
                        @Override
                        public void onSuccess(Text result) {
                            List<Text.TextBlock> blocks = result.getTextBlocks();
                            WritableArray blocksArray = Arguments.createArray();

                            for (Text.TextBlock block : blocks) {
                                WritableMap blockMap = Arguments.createMap();
                                blockMap.putString("text", block.getText());
                                blocksArray.pushMap(blockMap);
                            }

                            WritableMap response = Arguments.createMap();
                            response.putArray("blocks", blocksArray);

                            promise.resolve(response);
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            promise.reject("TEXT_RECOGNITION_ERROR", e.getMessage());
                        }
                    });
        } catch (IOException e) {
            promise.reject("IMAGE_LOADING_ERROR", e.getMessage());
        }
    }
}
