import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidFiles';

export async function downloadAndroidProjectZip(onProgress?: (progress: number) => void): Promise<void> {
  const zip = new JSZip();

  // Add all Android Studio project files
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add additional boilerplate files if needed
  zip.file('.gitignore', `*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
*.apk
*.aab`);

  zip.file('gradlew', `#!/bin/sh
if [ -d "./android" ]; then
  cd android && ./gradlew "$@"
else
  ./android/gradlew "$@"
fi
`);

  const blob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(Math.round(metadata.percent));
    }
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Millizai-AI-Android-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
