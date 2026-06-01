import { View } from "react-native";

import { Alert, Button, CloseButton, Spinner, Text } from "../..";

export function Basic() {
  return (
    <View className="w-full max-w-xl gap-4">
      <Alert>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>New features available</Alert.Title>
          <Alert.Description>
            Check out our latest updates including dark mode support and improved accessibility
            features.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <Alert status="accent">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Update available</Alert.Title>
          <Alert.Description>
            A new version of the application is available. Please refresh to get the latest features
            and bug fixes.
          </Alert.Description>
          <Button className="mt-2 self-start" size="sm" variant="primary">
            Refresh
          </Button>
        </Alert.Content>
      </Alert>

      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Unable to connect to server</Alert.Title>
          <Alert.Description>
            We're experiencing connection issues. Please try the following:
          </Alert.Description>
          <View className="mt-2 gap-1">
            <Text className="text-sm text-muted">- Check your internet connection</Text>
            <Text className="text-sm text-muted">- Refresh the page</Text>
            <Text className="text-sm text-muted">- Clear your browser cache</Text>
          </View>
          <Button className="mt-2 self-start" size="sm" variant="danger">
            Retry
          </Button>
        </Alert.Content>
      </Alert>

      <Alert status="success">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Profile updated successfully</Alert.Title>
        </Alert.Content>
        <CloseButton accessibilityLabel="Dismiss profile update" />
      </Alert>

      <Alert status="accent">
        <Alert.Indicator>
          <Spinner size="sm" />
        </Alert.Indicator>
        <Alert.Content>
          <Alert.Title>Processing your request</Alert.Title>
          <Alert.Description>
            Please wait while we sync your data. This may take a few moments.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <Alert status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Scheduled maintenance</Alert.Title>
          <Alert.Description>
            Our services will be unavailable on Sunday, March 15th from 2:00 AM to 6:00 AM UTC for
            scheduled maintenance.
          </Alert.Description>
        </Alert.Content>
      </Alert>
    </View>
  );
}
