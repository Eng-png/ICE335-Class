import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  LocateFixed,
  Mail,
  MapPin,
  Search,
  Send,
} from "lucide-react";

import { Badge } from "@workspace/getgigs-design-system/components/ui/badge";
import { Button } from "@workspace/getgigs-design-system/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/getgigs-design-system/components/ui/card";
import { Checkbox } from "@workspace/getgigs-design-system/components/ui/checkbox";
import { Input } from "@workspace/getgigs-design-system/components/ui/input";
import { Label } from "@workspace/getgigs-design-system/components/ui/label";
import { Separator } from "@workspace/getgigs-design-system/components/ui/separator";
import { Textarea } from "@workspace/getgigs-design-system/components/ui/textarea";

type JourneyView =
  | "search"
  | "empty"
  | "no-match"
  | "results"
  | "detail"
  | "email"
  | "pending"
  | "sent";

type Opportunity = "open" | "unclear" | "closed";

type Venue = {
  id: string;
  name: string;
  neighborhood: string;
  genres: string[];
  opportunity: Opportunity;
  opportunityLabel: string;
  description: string;
  fitNote: string;
};

const venues: Venue[] = [
  {
    id: "lantern-room",
    name: "The Lantern Room",
    neighborhood: "Bushwick",
    genres: ["Indie", "Alt", "Acoustic"],
    opportunity: "open",
    opportunityLabel: "Looking for performers",
    description:
      "A small listening room with a weekly local showcase and a focus on original sets.",
    fitNote: "A grounded first connection for artists building a local live set.",
  },
  {
    id: "maple-main",
    name: "Maple & Main",
    neighborhood: "Ditmas Park",
    genres: ["Folk", "Singer-songwriter"],
    opportunity: "closed",
    opportunityLabel: "Not currently looking",
    description:
      "A neighborhood cafe that hosts occasional daytime music, with no current call for acts.",
    fitNote: "Worth saving for later, but not the clearest next outreach today.",
  },
  {
    id: "signal-house",
    name: "Signal House",
    neighborhood: "Gowanus",
    genres: ["Rock", "Indie", "Electronic"],
    opportunity: "unclear",
    opportunityLabel: "Opportunity unclear",
    description:
      "A flexible art space with rotating events; performer details are not posted consistently.",
    fitNote: "A short email can clarify whether the current program fits your sound.",
  },
  {
    id: "juniper-hall",
    name: "Juniper Hall",
    neighborhood: "Crown Heights",
    genres: ["Jazz", "Soul", "R&B"],
    opportunity: "open",
    opportunityLabel: "Looking for performers",
    description:
      "A warm neighborhood room that shares a monthly open-call night for emerging acts.",
    fitNote: "A strong genre fit if your set leans toward soulful arrangements.",
  },
];

const steps = [
  { id: "search", label: "Discover" },
  { id: "results", label: "Compare" },
  { id: "detail", label: "Assess fit" },
  { id: "email", label: "Connect" },
];

function statusVariant(opportunity: Opportunity) {
  if (opportunity === "open") return "default" as const;
  if (opportunity === "unclear") return "secondary" as const;
  return "outline" as const;
}

function AssumptionNote() {
  return (
    <div className="rounded-md border border-dashed bg-muted p-3 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Assumed for this prototype:</span>{" "}
      venue opportunity status and contact details are example data, and the artist is
      searching from Brooklyn, NY. Current location permission, venue verification, and
      email delivery details are still assumptions.
    </div>
  );
}

function JourneyRail({ view }: { view: JourneyView }) {
  const activeStep =
    view === "search" || view === "empty" || view === "no-match"
      ? "search"
      : view === "results"
        ? "results"
        : view === "detail"
          ? "detail"
          : "email";

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete =
          steps.findIndex((item) => item.id === activeStep) > index ||
          view === "sent";
        return (
          <div className="flex items-center gap-2" key={step.id}>
            <div
              className={`flex items-center gap-2 ${
                isActive
                  ? "font-medium text-foreground"
                  : isComplete
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isComplete
                      ? "border-primary text-primary"
                      : "border-border"
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-lg font-semibold tracking-tight">getgigs</p>
          <p className="text-xs text-muted-foreground">Artist discovery</p>
        </div>
        <Badge variant="outline">Prototype journey</Badge>
      </div>
    </header>
  );
}

function SearchView({
  location,
  locationMessage,
  onLocationChange,
  onSearch,
  onUseCurrentLocation,
}: {
  location: string;
  locationMessage: string;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  onUseCurrentLocation: () => void;
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <Badge className="w-fit" variant="secondary">
          Start nearby
        </Badge>
        <CardTitle className="text-2xl">Find a place to play</CardTitle>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Search nearby venues and see whether they appear open to performers before
          you reach out.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="grid gap-4 md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="search-location">Search near</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                id="search-location"
                onChange={(event) => onLocationChange(event.target.value)}
                placeholder="Neighborhood, city, or ZIP code"
                value={location}
              />
            </div>
            {locationMessage ? (
              <p className="text-xs text-primary">{locationMessage}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Choose a starting point to see local venues.
              </p>
            )}
          </div>
          <div className="flex items-end">
            <Button className="w-full md:w-auto" type="submit">
              <Search />
              Search venues
            </Button>
          </div>
        </form>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Not sure what to enter?</p>
            <p className="text-sm text-muted-foreground">
              Use your current location as a starting point.
            </p>
          </div>
          <Button onClick={onUseCurrentLocation} variant="outline">
            <LocateFixed />
            Use current location
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptySearchView({
  onBack,
  onUseCurrentLocation,
}: {
  onBack: () => void;
  onUseCurrentLocation: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5 p-8">
        <div className="grid h-12 w-12 place-items-center rounded-md border bg-muted">
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl">Choose a location first</CardTitle>
          <p className="max-w-lg text-sm text-muted-foreground">
            We need a neighborhood, city, or current location to look for nearby venues.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onUseCurrentLocation}>
            <LocateFixed />
            Use current location
          </Button>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft />
            Back to search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NoMatchView({
  location,
  onBack,
}: {
  location: string;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5 p-8">
        <Badge variant="secondary">No matches yet</Badge>
        <div className="space-y-2">
          <CardTitle className="text-xl">Nothing nearby for {location}</CardTitle>
          <p className="max-w-xl text-sm text-muted-foreground">
            Try a nearby neighborhood or broaden the search area. This prototype does
            not treat an empty result as a dead end.
          </p>
        </div>
        <Button onClick={onBack}>
          <ArrowLeft />
          Try another location
        </Button>
      </CardContent>
    </Card>
  );
}

function VenueCard({
  venue,
  onOpen,
}: {
  venue: Venue;
  onOpen: (venue: Venue) => void;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{venue.name}</CardTitle>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {venue.neighborhood}
            </p>
          </div>
          <Badge variant={statusVariant(venue.opportunity)}>
            {venue.opportunityLabel}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {venue.genres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <p className="text-sm leading-6 text-muted-foreground">{venue.description}</p>
        <Button className="mt-auto w-full" onClick={() => onOpen(venue)} variant="outline">
          Review venue
          <ArrowRight />
        </Button>
      </CardContent>
    </Card>
  );
}

function ResultsView({
  location,
  openOnly,
  onOpenOnlyChange,
  onOpenVenue,
  onBack,
}: {
  location: string;
  openOnly: boolean;
  onOpenOnlyChange: (checked: boolean) => void;
  onOpenVenue: (venue: Venue) => void;
  onBack: () => void;
}) {
  const visibleVenues = useMemo(
    () => (openOnly ? venues.filter((venue) => venue.opportunity === "open") : venues),
    [openOnly],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Nearby venues</Badge>
          <h1 className="text-2xl font-semibold tracking-tight">
            Places to explore near {location}
          </h1>
          <p className="text-sm text-muted-foreground">
            Start with opportunity status, then open a profile to check the fit.
          </p>
        </div>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft />
          Change search
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={openOnly}
              id="open-only"
              onCheckedChange={(checked) => onOpenOnlyChange(checked === true)}
            />
            <div className="space-y-1">
              <Label htmlFor="open-only">Show open opportunities only</Label>
              <p className="text-xs text-muted-foreground">
                Keep unclear and not-currently-looking venues in view when unchecked.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {visibleVenues.length} of {venues.length} nearby examples
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleVenues.map((venue) => (
          <VenueCard key={venue.id} onOpen={onOpenVenue} venue={venue} />
        ))}
      </div>
    </div>
  );
}

function DetailView({
  venue,
  onBack,
  onContact,
}: {
  venue: Venue;
  onBack: () => void;
  onContact: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ArrowLeft />
        Back to nearby venues
      </Button>
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {venue.neighborhood}
              </p>
              <CardTitle className="text-3xl">{venue.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                {venue.genres.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant={statusVariant(venue.opportunity)}>
              {venue.opportunityLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 border-y py-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Opportunity signal
              </p>
              <p className="mt-1 font-medium">{venue.opportunityLabel}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Neighborhood
              </p>
              <p className="mt-1 font-medium">{venue.neighborhood}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="font-semibold">About this venue</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {venue.description}
            </p>
          </div>
          <div className="rounded-md border bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">Why it may fit:</span> {venue.fitNote}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={onContact}>
              <Mail />
              Contact this venue
            </Button>
            <p className="text-xs text-muted-foreground">
              Draft a short first connection. No booking commitment is made here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmailView({
  venue,
  artistName,
  bandName,
  genre,
  songLinks,
  message,
  onArtistNameChange,
  onBandNameChange,
  onGenreChange,
  onSongLinksChange,
  onMessageChange,
  onBack,
  onSend,
}: {
  venue: Venue;
  artistName: string;
  bandName: string;
  genre: string;
  songLinks: string;
  message: string;
  onArtistNameChange: (value: string) => void;
  onBandNameChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onSongLinksChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onBack: () => void;
  onSend: () => void;
}) {
  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ArrowLeft />
        Back to venue profile
      </Button>
      <div className="space-y-2">
        <Badge variant="secondary">First connection</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">
          Draft an email to {venue.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep it concise, specific, and easy for the venue to respond to.
        </p>
      </div>
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="artist-name">Artist name</Label>
              <Input
                id="artist-name"
                onChange={(event) => onArtistNameChange(event.target.value)}
                placeholder="Your name"
                value={artistName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="band-name">Band or project name</Label>
              <Input
                id="band-name"
                onChange={(event) => onBandNameChange(event.target.value)}
                placeholder="Optional project name"
                value={bandName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                onChange={(event) => onGenreChange(event.target.value)}
                placeholder="Indie, folk, jazz..."
                value={genre}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-links">Song links</Label>
              <Input
                id="song-links"
                onChange={(event) => onSongLinksChange(event.target.value)}
                placeholder="Add streaming or live links"
                value={songLinks}
              />
              <p className="text-xs text-muted-foreground">Placeholder for 1–2 links.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="first-message">First-contact message</Label>
            <Textarea
              id="first-message"
              onChange={(event) => onMessageChange(event.target.value)}
              rows={6}
              value={message}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              To: venue contact details are assumed for this prototype.
            </p>
            <div className="flex gap-2">
              <Button onClick={onBack} variant="outline">
                Cancel
              </Button>
              <Button
                disabled={!artistName.trim() || !message.trim()}
                onClick={onSend}
              >
                <Send />
                Send connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PendingView({ venue }: { venue: Venue }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5 p-8">
        <Badge variant="secondary">Sending</Badge>
        <div className="space-y-2">
          <CardTitle className="text-xl">Sending your note to {venue.name}</CardTitle>
          <p className="max-w-lg text-sm text-muted-foreground">
            Your first connection is being prepared. This prototype uses a short
            pending state before confirmation.
          </p>
        </div>
        <div className="h-1 w-full max-w-sm overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
}

function SentView({
  venue,
  onBackToDiscovery,
}: {
  venue: Venue;
  onBackToDiscovery: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-5 p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-primary text-primary">
          <Check className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <Badge>Connection sent</Badge>
          <CardTitle className="text-xl">Your note is on its way</CardTitle>
          <p className="max-w-xl text-sm text-muted-foreground">
            The connection to {venue.name} is marked as sent in this prototype. Continue
            discovering nearby venues when you are ready.
          </p>
        </div>
        <Button onClick={onBackToDiscovery}>
          <Search />
          Back to discovery
        </Button>
      </CardContent>
    </Card>
  );
}

export function ArtistVenueJourney() {
  const [view, setView] = useState<JourneyView>("search");
  const [location, setLocation] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue>(venues[0]);
  const [openOnly, setOpenOnly] = useState(false);
  const [artistName, setArtistName] = useState("");
  const [bandName, setBandName] = useState("");
  const [genre, setGenre] = useState("");
  const [songLinks, setSongLinks] = useState("");
  const [message, setMessage] = useState(
    "Hi, I’m an independent artist and I’m reaching out because I love the kind of local music your room supports. I’d be glad to share a short set if you are open to new performers. Would you be the right person to speak with about upcoming opportunities?",
  );

  useEffect(() => {
    if (view !== "pending") return;
    const timer = window.setTimeout(() => setView("sent"), 1100);
    return () => window.clearTimeout(timer);
  }, [view]);

  const handleSearch = () => {
    const query = location.trim();
    if (!query) {
      setView("empty");
      return;
    }
    if (/nowhere|no match|far away/i.test(query)) {
      setView("no-match");
      return;
    }
    setLocation(query);
    setOpenOnly(false);
    setView("results");
  };

  const useCurrentLocation = () => {
    setLocation("Brooklyn, NY");
    setLocationMessage("Using your current location: Brooklyn, NY");
    setView("search");
  };

  const goToSearch = () => {
    setView("search");
    setLocationMessage("");
  };

  const openVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setView("detail");
  };

  const openEmail = () => {
    setView("email");
  };

  const sendEmail = () => {
    setView("pending");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 border-b pb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Artist journey</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                From nearby discovery to first connection
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">Step {view === "sent" ? 4 : view === "pending" || view === "email" ? 4 : view === "detail" ? 3 : view === "results" ? 2 : 1} of 4</p>
          </div>
          <JourneyRail view={view} />
        </div>

        {view === "search" ? (
          <SearchView
            location={location}
            locationMessage={locationMessage}
            onLocationChange={(value) => {
              setLocation(value);
              setLocationMessage("");
            }}
            onSearch={handleSearch}
            onUseCurrentLocation={useCurrentLocation}
          />
        ) : null}
        {view === "empty" ? (
          <EmptySearchView onBack={goToSearch} onUseCurrentLocation={useCurrentLocation} />
        ) : null}
        {view === "no-match" ? (
          <NoMatchView location={location} onBack={goToSearch} />
        ) : null}
        {view === "results" ? (
          <ResultsView
            location={location}
            onBack={goToSearch}
            onOpenOnlyChange={setOpenOnly}
            onOpenVenue={openVenue}
            openOnly={openOnly}
          />
        ) : null}
        {view === "detail" ? (
          <DetailView
            onBack={() => setView("results")}
            onContact={openEmail}
            venue={selectedVenue}
          />
        ) : null}
        {view === "email" ? (
          <EmailView
            artistName={artistName}
            bandName={bandName}
            genre={genre}
            message={message}
            onArtistNameChange={setArtistName}
            onBack={() => setView("detail")}
            onBandNameChange={setBandName}
            onGenreChange={setGenre}
            onMessageChange={setMessage}
            onSend={sendEmail}
            onSongLinksChange={setSongLinks}
            songLinks={songLinks}
            venue={selectedVenue}
          />
        ) : null}
        {view === "pending" ? <PendingView venue={selectedVenue} /> : null}
        {view === "sent" ? (
          <SentView venue={selectedVenue} onBackToDiscovery={goToSearch} />
        ) : null}

        <AssumptionNote />
      </main>
    </div>
  );
}

export default ArtistVenueJourney;