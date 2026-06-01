import { Alert, View } from "react-native";

import { Avatar, Button, Card, CloseButton, Input, Label, Link, Text, TextField } from "../..";

const COLORS = {
  ai: "#4facfe",
  avocado: "#a8edea",
  cherries: "#ff7e5f",
  indie: "#667eea",
  neoBg: "#ffd1ff",
  neoProduct: "#fcb69f",
  robot: "#5ee7df",
  sound: "#ff9a9e",
};

function ColorTile({
  accessibilityLabel,
  className,
  color,
}: {
  accessibilityLabel: string;
  className?: string;
  color: string;
}) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      className={`rounded-2xl ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function Default() {
  return (
    <Card className="w-full max-w-[400px] gap-4">
      <Text className="text-2xl text-primary">$</Text>
      <Card.Header className="gap-1">
        <Card.Title>Become an Acme Creator!</Card.Title>
        <Card.Description>
          Visit the Acme Creator Hub to sign up today and start earning credits from your fans and
          followers.
        </Card.Description>
      </Card.Header>
      <Card.Footer>
        <Link href="https://pitsiui.com">
          <Text className="text-link font-medium underline">Creator Hub</Text>
          <Link.Icon />
        </Link>
      </Card.Footer>
    </Card>
  );
}

export function Horizontal() {
  return (
    <Card className="w-full items-stretch gap-4">
      <ColorTile
        accessibilityLabel="Cherries"
        className="h-[140px] w-full"
        color={COLORS.cherries}
      />
      <View className="gap-3">
        <Card.Header className="gap-1">
          <View className="flex-row items-start justify-between gap-3">
            <Card.Title className="flex-1">Become an ACME Creator!</Card.Title>
            <CloseButton accessibilityLabel="Close banner" />
          </View>
          <Card.Description>
            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet
            faucibus etiam.
          </Card.Description>
        </Card.Header>
        <Card.Footer className="gap-3">
          <View>
            <Text className="text-sm font-medium text-foreground">Only 10 spots</Text>
            <Text className="text-xs text-muted">Submission ends Oct 10.</Text>
          </View>
          <Button className="w-full">Apply Now</Button>
        </Card.Footer>
      </View>
    </Card>
  );
}

export function Variants() {
  return (
    <View className="w-full max-w-[320px] gap-4">
      <Card variant="transparent">
        <Card.Header>
          <Card.Title>Transparent</Card.Title>
          <Card.Description>Minimal prominence with transparent background</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text>Use for less important content or nested cards</Text>
        </Card.Body>
      </Card>

      <Card variant="default">
        <Card.Header>
          <Card.Title>Default</Card.Title>
          <Card.Description>Standard card appearance</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text>The default card variant for most use cases</Text>
        </Card.Body>
      </Card>

      <Card variant="secondary">
        <Card.Header>
          <Card.Title>Secondary</Card.Title>
          <Card.Description>Medium prominence</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text>Use to draw moderate attention</Text>
        </Card.Body>
      </Card>

      <Card variant="tertiary">
        <Card.Header>
          <Card.Title>Tertiary</Card.Title>
          <Card.Description>Higher prominence</Card.Description>
        </Card.Header>
        <Card.Body>
          <Text>Use for primary or featured content</Text>
        </Card.Body>
      </Card>
    </View>
  );
}

export function WithAvatar() {
  return (
    <View className="flex-row flex-wrap gap-4">
      <Card className="w-[200px] gap-2">
        <ColorTile
          accessibilityLabel="Indie Hackers community"
          className="h-14 w-14"
          color={COLORS.indie}
        />
        <Card.Header>
          <Card.Title>Indie Hackers</Card.Title>
          <Card.Description>148 members</Card.Description>
        </Card.Header>
        <Card.Footer className="flex-row items-center gap-2">
          <Avatar
            accessibilityLabel="Martha's profile picture"
            alt="Martha's profile picture"
            color="danger"
            size="sm"
          >
            <Avatar.Fallback textProps={{ className: "text-xs" }}>IH</Avatar.Fallback>
          </Avatar>
          <Text className="text-xs">By Martha</Text>
        </Card.Footer>
      </Card>

      <Card className="w-[200px] gap-2">
        <ColorTile
          accessibilityLabel="AI Builders community"
          className="h-14 w-14"
          color={COLORS.ai}
        />
        <Card.Header>
          <Card.Title>AI Builders</Card.Title>
          <Card.Description>362 members</Card.Description>
        </Card.Header>
        <Card.Footer className="flex-row items-center gap-2">
          <Avatar
            accessibilityLabel="John's profile picture"
            alt="John's profile picture"
            color="accent"
            size="sm"
          >
            <Avatar.Fallback textProps={{ className: "text-xs" }}>B</Avatar.Fallback>
          </Avatar>
          <Text className="text-xs">By John</Text>
        </Card.Footer>
      </Card>
    </View>
  );
}

export function WithForm() {
  return (
    <Card className="w-full max-w-md gap-4">
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>Enter your credentials to access your account</Card.Description>
      </Card.Header>
      <Card.Body className="gap-4">
        <TextField>
          <Label>Email</Label>
          <Input keyboardType="email-address" placeholder="email@example.com" variant="secondary" />
        </TextField>
        <TextField>
          <Label>Password</Label>
          <Input placeholder="Password" secureTextEntry variant="secondary" />
        </TextField>
      </Card.Body>
      <Card.Footer className="gap-2">
        <Button className="w-full" onPress={() => Alert.alert("Form submitted successfully!")}>
          Sign In
        </Button>
        <Link className="self-center" href="#">
          <Text className="text-center text-sm text-link underline">Forgot password?</Text>
        </Link>
      </Card.Footer>
    </Card>
  );
}

export function WithImages() {
  return (
    <View className="w-full max-w-2xl gap-4 p-4">
      <Card className="gap-4">
        <ColorTile
          accessibilityLabel="Cherries"
          className="h-[140px] w-full"
          color={COLORS.cherries}
        />
        <Card.Header className="gap-1">
          <View className="flex-row items-start justify-between gap-3">
            <Card.Title className="flex-1">Become an ACME Creator!</Card.Title>
            <CloseButton accessibilityLabel="Close banner" />
          </View>
          <Card.Description>
            Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet
            faucibus etiam.
          </Card.Description>
        </Card.Header>
        <Card.Footer className="gap-3">
          <View>
            <Text className="text-sm font-medium text-foreground">Only 10 spots</Text>
            <Text className="text-xs text-muted">Submission ends Oct 10.</Text>
          </View>
          <Button className="w-full">Apply Now</Button>
        </Card.Footer>
      </Card>

      <View className="gap-4">
        <Card className="gap-3">
          <View className="flex-row items-start justify-between gap-3">
            <Text className="text-3xl text-primary">$</Text>
            <CloseButton accessibilityLabel="Close notification" />
          </View>
          <Card.Header>
            <Text className="text-xs font-medium uppercase text-muted">Payment</Text>
            <Card.Title>You can now withdraw on crypto</Card.Title>
            <Card.Description>Add your wallet in settings to withdraw</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Link href="#">
              <Text className="text-link font-medium underline">Go to settings</Text>
              <Link.Icon />
            </Link>
          </Card.Footer>
        </Card>

        <View className="flex-row flex-wrap gap-4">
          <Card className="min-w-[150px] flex-1 gap-2">
            <Avatar alt="Indie Hackers community" color="accent" size="lg">
              <Avatar.Fallback>JK</Avatar.Fallback>
            </Avatar>
            <Card.Body>
              <Text className="text-sm font-medium">Indie Hackers</Text>
              <Text className="text-xs text-muted">148 members</Text>
            </Card.Body>
            <Card.Footer className="flex-row items-center gap-2">
              <Avatar alt="John's profile picture" color="danger" size="sm">
                <Avatar.Fallback textProps={{ className: "text-[8px]" }}>JK</Avatar.Fallback>
              </Avatar>
              <Text className="text-xs text-muted">By John</Text>
            </Card.Footer>
          </Card>

          <Card className="min-w-[150px] flex-1 gap-2">
            <Avatar alt="AI Builders community" color="success" size="lg">
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar>
            <Card.Body>
              <Text className="text-sm font-medium">AI Builders</Text>
              <Text className="text-xs text-muted">362 members</Text>
            </Card.Body>
            <Card.Footer className="flex-row items-center gap-2">
              <Avatar alt="Martha's profile picture" color="accent" size="sm">
                <Avatar.Fallback textProps={{ className: "text-[8px]" }}>M</Avatar.Fallback>
              </Avatar>
              <Text className="text-xs text-muted">By Martha</Text>
            </Card.Footer>
          </Card>
        </View>

        <Card className="min-h-[200px] gap-6" style={{ backgroundColor: COLORS.neoBg }}>
          <Card.Header>
            <Card.Title className="text-xs font-semibold uppercase text-black">NEO</Card.Title>
            <Card.Description className="text-sm font-medium text-black/60">
              Home Robot
            </Card.Description>
          </Card.Header>
          <Card.Footer className="mt-auto flex-row items-end justify-between">
            <View>
              <Text className="text-sm font-medium text-black">Available soon</Text>
              <Text className="text-xs text-black/60">Get notified</Text>
            </View>
            <Button className="bg-white" size="sm" variant="tertiary">
              Notify me
            </Button>
          </Card.Footer>
        </Card>
      </View>

      <Card className="h-[260px]" style={{ backgroundColor: COLORS.neoProduct }}>
        <Card.Footer className="mt-auto flex-row items-end justify-between">
          <View>
            <Text className="text-base font-medium text-black">NEO</Text>
            <Text className="text-xs font-medium text-black/60">$499/m</Text>
          </View>
          <Button className="bg-white" size="sm" variant="tertiary">
            Get now
          </Button>
        </Card.Footer>
      </Card>

      <View className="gap-2">
        <Card className="flex-row gap-3 p-1" variant="transparent">
          <ColorTile
            accessibilityLabel="Futuristic Robot"
            className="h-16 w-16"
            color={COLORS.robot}
          />
          <View className="flex-1 justify-center gap-1">
            <Card.Title className="text-sm">Bridging the Future</Card.Title>
            <Card.Description className="text-xs">Today, 6:30 PM</Card.Description>
          </View>
        </Card>
        <Card className="flex-row gap-3 p-1" variant="transparent">
          <ColorTile accessibilityLabel="Avocado" className="h-16 w-16" color={COLORS.avocado} />
          <View className="flex-1 justify-center gap-1">
            <Card.Title className="text-sm">Avocado Hackathon</Card.Title>
            <Card.Description className="text-xs">Wed, 4:30 PM</Card.Description>
          </View>
        </Card>
        <Card className="flex-row gap-3 p-1" variant="transparent">
          <ColorTile
            accessibilityLabel="Sound Electro event"
            className="h-16 w-16"
            color={COLORS.sound}
          />
          <View className="flex-1 justify-center gap-1">
            <Card.Title className="text-sm">Sound Electro | Beyond art</Card.Title>
            <Card.Description className="text-xs">Fri, 8:00 PM</Card.Description>
          </View>
        </Card>
      </View>
    </View>
  );
}
