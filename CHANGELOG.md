# 1.0.13
 - Added possibility to set id on input
 - Code documentation improvements

# 1.0.12
 - fall back to POST when not supplying method to upload service #17
 - reset input value when done extracting files from input #26

# 1.0.11
 - allow `require` to be specified without a value and thus be translated to a true

# 1.0.10
 - required was being set even though the attribute wasn't present

# 1.0.9
 - Remove options object since it made the uploadButton more advanced then it needed to be.
 - Add onUpload callbacks which fires when the upload starts
 - Add required attributes that adds ng-invalid ng-invalid-required when it's set.

   Since the upload empties itself when done, you need set required="false" explicitly
   when you are done uploading to remove the required attribute on the file input

 - Better documentation and examples

# 1.0.8
 - Retain headers if there are any #15

# 1.0.7
 - Removed javascript styling of upload button that was causing width=0 height=0

# 1.0.6
 - uploadButton
  - one way databinding for accept and multiple and forceIFrame

# 1.0.5
 - uploadButton
  - Only upload if any files where selected
  - accept attribute (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Input#attr-accept)
  	Also allows for an js array as input

# 1.0.4
 - empty input fix

# 1.0.3
 - bump test

# 1.0.2
 - Don't replace the clone when done uploading, since you usually want the input to be cleared.
 - Added onComplete that fires for both success and failure

# 1.0.1
 - Fixed #4 should allow setting url from options object

# 1.0.0
 - Fixed #2 the upload would send Content-Type: false

# 0.0.2
- Don't depend on bootstrap in uploadButton lessfile

# 0.0.1 Concept version
FormData upload
