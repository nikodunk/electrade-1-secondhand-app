How to install

	cd node_modules/react-native
	./scripts/ios-install-third-party.sh

	react-native run-ios

	react-native run-ios --simulator="iPhone 6 Plus"
	react-native run-ios --simulator="iPad Pro (12.9-inch) (2nd generation)"
	react-native run-ios --simulator="iPad Pro (12.9-inch) (3rd generation)"


	react-native run-android


To build for android release, run:

	cd android && ./gradlew assembleRelease


To build for iOS release, run:

	cd ios && xcodebuild -scheme electric -workspace electric.xcworkspace/ build


![](demo.png)