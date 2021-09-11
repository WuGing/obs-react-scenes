#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
# Twitch Environment Settings 
ENV Twitch_ChannelName=""
ENV Twitch_ChannelId=""
ENV Twitch_Api_ClientId=""
ENV Twitch_Api_Secret=""
ENV Twitch_Api_CallbackUrl=""
ENV Twitch_PubSub_OAuth=""
#
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["OBS React Scenes/OBS React Scenes.csproj", "OBS React Scenes/"]
RUN dotnet restore "OBS React Scenes/OBS React Scenes.csproj"
COPY . .
WORKDIR "/src/OBS React Scenes"
RUN dotnet build "OBS React Scenes.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OBS React Scenes.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OBS React Scenes.dll"]