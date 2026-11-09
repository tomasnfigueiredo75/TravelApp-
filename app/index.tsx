import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Modal,
  Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch,
  Text, TextInput, View
} from "react-native";
import * as Notifications from "expo-notifications";
import { Destination, Review, Trip, User } from "../src/types";
import { getDestinations } from "../src/data/destinations";
import { storage } from "../src/services/storage";

type Tab = "Descobrir" | "Viagens" | "Favoritos" | "Perfil";
const GREEN = "#2F7D5B";
const CREAM = "#F7F3EE";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("Descobrir");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selected, setSelected] = useState<Destination | null>(null);
  const [settings, setSettings] = useState({ dark: false, notifications: true });
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [tripStart, setTripStart] = useState("");
  const [tripEnd, setTripEnd] = useState("");
  const [tripNotes, setTripNotes] = useState("");

  const dark = settings.dark;
  const bg = dark ? "#161514" : "#FFFFFF";
  const card = dark ? "#21201E" : CREAM;
  const fg = dark ? "#F0EBE6" : "#1A1A1A";
  const muted = dark ? "#AAA39C" : "#737373";

  useEffect(() => {
    (async () => {
      const [session, favs, savedTrips, savedReviews, savedSettings] = await Promise.all([
        storage.getSession(), storage.getFavorites(), storage.getTrips(), storage.getReviews(), storage.getSettings()
      ]);
      setUser(session); setFavorites(favs); setTrips(savedTrips); setReviews(savedReviews); setSettings(savedSettings);
      loadApi();
    })();
  }, []);

  async function loadApi() {
    setLoading(true); setApiError("");
    try { setDestinations(await getDestinations()); }
    catch (e: any) { setApiError(e.message || "Erro de ligação à API."); }
    finally { setLoading(false); }
  }

  const visible = useMemo(() => destinations.filter(d =>
    (category === "Todos" || d.category === category) &&
    `${d.name} ${d.capital} ${d.region}`.toLowerCase().includes(search.toLowerCase())
  ), [destinations, category, search]);

  async function authenticate() {
    setAuthError("");
    try {
      const next = authMode === "register"
        ? await storage.register(name, email, password)
        : await storage.login(email, password);
      setUser(next);
    } catch (e: any) { setAuthError(e.message || "Não foi possível autenticar."); }
  }

  async function toggleFavorite(code: string) {
    const next = favorites.includes(code) ? favorites.filter(x => x !== code) : [...favorites, code];
    setFavorites(next); await storage.saveFavorites(next);
  }

  async function createTrip(destination: Destination) {
    if (!tripStart || !tripEnd) return Alert.alert("Datas necessárias", "Indica a data de início e de fim (AAAA-MM-DD).");
    const start = new Date(tripStart), end = new Date(tripEnd);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return Alert.alert("Datas inválidas", "Confirma as datas da viagem.");
    }
    const trip = { id: `${Date.now()}`, destination, start: tripStart, end: tripEnd, notes: tripNotes };
    const next = [trip, ...trips]; setTrips(next); await storage.saveTrips(next);
    setTripStart(""); setTripEnd(""); setTripNotes("");
    Alert.alert("Viagem guardada", `${destination.name} foi adicionada ao teu itinerário.`);
  }

  async function addReview(destination: Destination) {
    if (!reviewText.trim()) return Alert.alert("Comentário vazio", "Escreve um comentário antes de publicar.");
    const review: Review = {
      id: `${Date.now()}`, destinationCode: destination.code, author: user?.name || "Viajante",
      rating: Math.min(5, Math.max(1, Number(reviewRating) || 5)), comment: reviewText.trim(),
      date: new Date().toLocaleDateString("pt-PT")
    };
    const next = [review, ...reviews]; setReviews(next); await storage.saveReviews(next);
    setReviewText(""); Alert.alert("Obrigado!", "A tua avaliação foi guardada.");
  }

  async function testNotification() {
    if (Platform.OS === "web") return Alert.alert("Disponibilidade", "As notificações locais devem ser testadas num dispositivo ou emulador nativo.");
    const permission = await Notifications.requestPermissionsAsync();
    if (permission.status !== "granted") return Alert.alert("Permissão necessária", "Ativa as notificações nas definições do dispositivo.");
    await Notifications.scheduleNotificationAsync({
      content: { title: "TravelApp", body: "As notificações estão a funcionar. Boa viagem!" },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 3 }
    });
    Alert.alert("Notificação agendada", "Vais receber uma notificação de teste dentro de 3 segundos.");
  }

  async function updateSettings(next: typeof settings) {
    setSettings(next); await storage.saveSettings(next);
  }

  if (!user) return (
    <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.authWrap}>
        <Text style={s.brand}>✦ TravelApp</Text>
        <Text style={[s.heroTitle, { color: fg }]}>O mundo espera por ti.</Text>
        <Text style={[s.muted, { color: muted }]}>Descobre destinos, guarda favoritos e planeia a tua próxima viagem.</Text>
        {authMode === "register" && <TextInput accessibilityLabel="Nome de utilizador" placeholder="Nome de utilizador" value={name} onChangeText={setName} style={s.input} />}
        <TextInput accessibilityLabel="Email" placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={s.input} />
        <TextInput accessibilityLabel="Palavra-passe" placeholder="Palavra-passe (mínimo 6 caracteres)" secureTextEntry value={password} onChangeText={setPassword} style={s.input} />
        {!!authError && <Text style={s.error}>{authError}</Text>}
        <Pressable style={s.primary} onPress={authenticate}><Text style={s.primaryText}>{authMode === "register" ? "Criar conta" : "Entrar"}</Text></Pressable>
        <Pressable onPress={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}>
          <Text style={[s.link, { color: GREEN }]}>{authMode === "login" ? "Ainda não tens conta? Regista-te" : "Já tens conta? Inicia sessão"}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const content = () => {
    if (tab === "Descobrir") return <>
      <Text style={[s.title, { color: fg }]}>Descobrir</Text>
      <Text style={[s.muted, { color: muted }]}>A tua próxima aventura começa aqui.</Text>
      <TextInput placeholder="Para onde queres ir?" value={search} onChangeText={setSearch} style={s.input} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 48 }}>
        {["Todos", "Praias", "Cidades", "Natureza", "Cultura"].map(c => <Pressable key={c} onPress={() => setCategory(c)} style={[s.chip, category === c && s.chipActive]}><Text style={{ color: category === c ? "#FFF" : GREEN }}>{c}</Text></Pressable>)}
      </ScrollView>
      {loading ? <ActivityIndicator color={GREEN} size="large" /> : apiError ? <View style={s.empty}><Text style={[s.body, { color: fg }]}>{apiError}</Text><Pressable onPress={loadApi}><Text style={s.link}>Tentar novamente</Text></Pressable></View> :
        visible.map(d => <DestinationCard key={d.code} d={d} favorite={favorites.includes(d.code)} onFavorite={() => toggleFavorite(d.code)} onOpen={() => setSelected(d)} />)}
    </>;
    if (tab === "Favoritos") {
      const favs = destinations.filter(d => favorites.includes(d.code));
      return <><Text style={[s.title, { color: fg }]}>Favoritos</Text>{favs.length ? favs.map(d => <DestinationCard key={d.code} d={d} favorite onFavorite={() => toggleFavorite(d.code)} onOpen={() => setSelected(d)} />) : <Empty text="Ainda não guardaste destinos." image={require("../assets/empty-favorites.png")} />}</>;
    }
    if (tab === "Viagens") return <>
      <Text style={[s.title, { color: fg }]}>As minhas viagens</Text>
      {trips.length ? trips.map(t => <View key={t.id} style={[s.trip, { backgroundColor: card }]}><Text style={[s.cardTitle, { color: fg }]}>{t.destination.name}</Text><Text style={{ color: muted }}>{t.start} — {t.end}</Text>{!!t.notes && <Text style={{ color: fg }}>{t.notes}</Text>}<Pressable onPress={() => Alert.alert("Eliminar viagem", "Queres eliminar esta viagem?", [{ text: "Cancelar" }, { text: "Eliminar", style: "destructive", onPress: async () => { const next = trips.filter(x => x.id !== t.id); setTrips(next); await storage.saveTrips(next); } }])}><Text style={s.link}>Eliminar</Text></Pressable></View>) : <Empty text="Ainda não tens viagens planeadas." image={require("../assets/empty-trips.png")} />}
      <Text style={[s.section, { color: fg }]}>Adicionar viagem</Text>
      <TextInput placeholder="Destino (seleciona primeiro em Descobrir)" editable={false} style={s.input} value={selected?.name || ""} />
      <TextInput placeholder="Data de início (AAAA-MM-DD)" value={tripStart} onChangeText={setTripStart} style={s.input} />
      <TextInput placeholder="Data de fim (AAAA-MM-DD)" value={tripEnd} onChangeText={setTripEnd} style={s.input} />
      <TextInput placeholder="Notas / itinerário" value={tripNotes} onChangeText={setTripNotes} style={[s.input, { height: 80 }]} multiline />
      {selected && <Pressable style={s.primary} onPress={() => createTrip(selected)}><Text style={s.primaryText}>Guardar viagem para {selected.name}</Text></Pressable>}
      {!selected && <Text style={{ color: muted }}>Abre um destino em Descobrir e escolhe “Planear viagem”.</Text>}
    </>;
    return <>
      <Text style={[s.title, { color: fg }]}>Perfil e definições</Text>
      <View style={[s.trip, { backgroundColor: card }]}><Text style={[s.cardTitle, { color: fg }]}>{user.name}</Text><Text style={{ color: muted }}>{user.email}</Text></View>
      <View style={[s.row, { backgroundColor: card }]}><Text style={{ color: fg }}>Modo escuro</Text><Switch value={settings.dark} onValueChange={v => updateSettings({ ...settings, dark: v })} /></View>
      <View style={[s.row, { backgroundColor: card }]}><Text style={{ color: fg }}>Notificações de viagem</Text><Switch value={settings.notifications} onValueChange={v => updateSettings({ ...settings, notifications: v })} /></View>
      <Pressable style={s.secondary} onPress={testNotification}><Text style={s.secondaryText}>Enviar notificação de teste</Text></Pressable>
      <Pressable style={s.secondary} onPress={async () => { await storage.logout(); setUser(null); }}><Text style={s.secondaryText}>Terminar sessão</Text></Pressable>
      <Text style={[s.section, { color: fg }]}>Sobre</Text><Text style={{ color: muted }}>TravelApp · Descobre. Planeia. Viaja.</Text>
    </>;
  };

  return <SafeAreaView style={[s.safe, { backgroundColor: bg }]}>
    <View style={s.header}><Text style={[s.brand, { color: GREEN }]}>✦ TravelApp</Text><Text style={{ color: muted }}>Olá, {user.name.split(" ")[0]}</Text></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{content()}</ScrollView>
    <View style={[s.tabs, { backgroundColor: card, borderColor: dark ? "#3B3835" : "#E5DFD7" }]}>
      {(["Descobrir", "Viagens", "Favoritos", "Perfil"] as Tab[]).map(t => <Pressable key={t} style={s.tab} onPress={() => setTab(t)}><Text style={{ color: tab === t ? GREEN : muted, fontSize: 12 }}>{({ Descobrir: "⌕", Viagens: "▣", Favoritos: "♡", Perfil: "○" } as any)[t]}</Text><Text style={{ color: tab === t ? GREEN : muted, fontSize: 11 }}>{t}</Text></Pressable>)}
    </View>
    <Modal visible={!!selected && tab !== "Viagens"} animationType="slide" onRequestClose={() => setSelected(null)}>
      {selected && <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
        <ScrollView>
          <Image source={{ uri: selected.image }} style={s.detailImage} />
          <View style={{ padding: 20 }}>
            <Pressable onPress={() => setSelected(null)}><Text style={s.link}>← Voltar</Text></Pressable>
            <Text style={[s.title, { color: fg }]}>{selected.name}</Text>
            <Text style={{ color: muted }}>{selected.capital} · {selected.region}</Text>
            <Text style={[s.body, { color: fg, marginTop: 14 }]}>{selected.description}</Text>
            <Text style={[s.body, { color: fg, marginTop: 10 }]}>População: {selected.population.toLocaleString("pt-PT")}</Text>
            <Pressable style={s.primary} onPress={() => toggleFavorite(selected.code)}><Text style={s.primaryText}>{favorites.includes(selected.code) ? "Remover dos favoritos" : "Guardar nos favoritos"}</Text></Pressable>
            <Pressable style={s.secondary} onPress={() => { setTab("Viagens"); }}><Text style={s.secondaryText}>Planear viagem para este destino</Text></Pressable>
            <Text style={[s.section, { color: fg }]}>Avaliações e comentários</Text>
            {reviews.filter(r => r.destinationCode === selected.code).map(r => <View key={r.id} style={[s.trip, { backgroundColor: card }]}><Text style={{ color: fg }}>{r.author} · {"★".repeat(r.rating)}</Text><Text style={{ color: fg }}>{r.comment}</Text><Text style={{ color: muted }}>{r.date}</Text></View>)}
            <TextInput placeholder="A tua avaliação..." value={reviewText} onChangeText={setReviewText} style={[s.input, { height: 90 }]} multiline />
            <TextInput placeholder="Classificação de 1 a 5" keyboardType="number-pad" value={reviewRating} onChangeText={setReviewRating} style={s.input} />
            <Pressable style={s.primary} onPress={() => addReview(selected)}><Text style={s.primaryText}>Publicar avaliação</Text></Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>}
    </Modal>
  </SafeAreaView>;
}

function DestinationCard({ d, favorite, onFavorite, onOpen }: { d: Destination; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return <Pressable onPress={onOpen} style={s.destination}>
    <Image source={{ uri: d.image }} style={s.destinationImage} />
    <View style={s.imageShade} />
    <View style={s.destinationText}><Text style={s.cardTitle}>{d.name}</Text><Text style={{ color: "#FFF" }}>{d.capital} · {d.region}</Text></View>
    <Pressable onPress={onFavorite} style={s.heart}><Text style={{ color: favorite ? "#E35D6A" : "#FFF", fontSize: 24 }}>{favorite ? "♥" : "♡"}</Text></Pressable>
  </Pressable>;
}
function Empty({ text, image }: { text: string; image?: any }) {
  return <View style={s.empty}>
    {image ? <Image source={image} style={{ width: "100%", height: 190, resizeMode: "contain" }} /> : <Text style={{ fontSize: 42 }}>✈</Text>}
    <Text style={s.body}>{text}</Text>
  </View>;
}

const s = StyleSheet.create({
  safe: { flex: 1 }, authWrap: { flex: 1, justifyContent: "center", padding: 26, gap: 14 },
  brand: { color: GREEN, fontSize: 22, fontWeight: "700" }, heroTitle: { fontSize: 32, fontWeight: "700", marginTop: 16 },
  title: { fontSize: 28, fontWeight: "700", marginTop: 10, marginBottom: 5 }, section: { fontSize: 19, fontWeight: "700", marginTop: 22, marginBottom: 10 },
  muted: { color: "#737373", fontSize: 14, lineHeight: 21, marginBottom: 12 }, body: { fontSize: 15, lineHeight: 23 },
  input: { backgroundColor: CREAM, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, marginVertical: 6, color: "#222", borderWidth: 1, borderColor: "#E5DFD7" },
  primary: { backgroundColor: GREEN, padding: 16, borderRadius: 14, alignItems: "center", marginVertical: 8 },
  primaryText: { color: "#FFF", fontWeight: "700" }, secondary: { borderColor: GREEN, borderWidth: 1, padding: 14, borderRadius: 14, alignItems: "center", marginVertical: 7 },
  secondaryText: { color: GREEN, fontWeight: "600" }, link: { color: GREEN, fontWeight: "600", paddingVertical: 10, textAlign: "center" },
  error: { color: "#C62828", fontSize: 13 }, header: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  content: { paddingHorizontal: 18, paddingBottom: 28 }, chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: CREAM, marginRight: 8, marginVertical: 5 },
  chipActive: { backgroundColor: GREEN }, destination: { height: 220, borderRadius: 22, overflow: "hidden", marginVertical: 9, backgroundColor: CREAM },
  destinationImage: { width: "100%", height: "100%", position: "absolute" }, imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.24)" },
  destinationText: { position: "absolute", bottom: 18, left: 18 }, cardTitle: { color: "#FFF", fontSize: 22, fontWeight: "700" },
  heart: { position: "absolute", top: 12, right: 14, backgroundColor: "rgba(0,0,0,0.25)", borderRadius: 30, width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  trip: { padding: 16, borderRadius: 16, marginVertical: 7, gap: 6 }, row: { padding: 15, borderRadius: 14, marginVertical: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  empty: { alignItems: "center", padding: 40, gap: 10 }, tabs: { flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, paddingVertical: 10, paddingBottom: Platform.OS === "ios" ? 18 : 10 },
  tab: { alignItems: "center", gap: 3, minWidth: 70 }, detailImage: { width: "100%", height: 280, backgroundColor: CREAM }
});
