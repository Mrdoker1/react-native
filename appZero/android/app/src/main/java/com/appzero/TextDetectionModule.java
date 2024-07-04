// package com.yourpackage;

// import android.net.Uri;
// import androidx.annotation.NonNull;
// import com.facebook.react.bridge.Promise;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.WritableArray;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.bridge.Arguments;

// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.google.mlkit.vision.common.InputImage;

// import com.google.android.gms.tasks.OnSuccessListener;
// import com.google.android.gms.tasks.OnFailureListener;

// import java.io.IOException;
// import java.util.List;

// import com.google.mlkit.vision.text.Text;
// import com.google.mlkit.vision.text.TextRecognition;
// import com.google.mlkit.vision.text.TextRecognitionOptions;
// import com.google.mlkit.vision.text.TextRecognizer;

// public class TextDetectionModule extends ReactContextBaseJavaModule {
//     private final ReactApplicationContext reactContext;

//     public TextDetectionModule(ReactApplicationContext context) {
//         super(context);
//         this.reactContext = context;
//     }

//     @NonNull
//     @Override
//     public String getName() {
//         return "TextDetectionModule";
//     }

//     @ReactMethod
//     public void recognizeImage(String url, Promise promise) {
//         Uri uri = Uri.parse(url);
//         InputImage image;
//         try {
//             image = InputImage.fromFilePath(getReactApplicationContext(), uri);
//             // When using Latin script library
//             TextRecognizer recognizer =
//                     TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);

//             recognizer.process(image)
//                     .addOnSuccessListener(new OnSuccessListener<Text>() {
//                         @Override
//                         public void onSuccess(Text result) {

//                             WritableMap response = Arguments.createMap();
//                             WritableArray blocks = Arguments.createArray();

//                             for (Text.TextBlock block : result.getTextBlocks()) {
//                                 WritableMap blockObject = Arguments.createMap();
//                                 blockObject.putString("text", block.getText());
//                                 blocks.pushMap(blockObject);
//                             }
                            
//                             response.putArray("blocks", blocks);
//                             promise.resolve(response);
//                         }
//                     })
//                     .addOnFailureListener(
//                             new OnFailureListener() {
//                                 @Override
//                                 public void onFailure(@NonNull Exception e) {
//                                     promise.reject("Create Event Error", e);
//                                 }
//                             });

//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }
// }
